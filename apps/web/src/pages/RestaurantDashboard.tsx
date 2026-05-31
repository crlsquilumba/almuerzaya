import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, DashboardNavItem } from '@components/layout/Header';
import { Container } from '@components/layout/Container';
import { Alert } from '@components/ui/Alert';
import { Spinner } from '@components/ui/Spinner';
import { RegisterAlmuerzo } from '@components/common/RegisterAlmuerzo';
import reservationService from '@services/reservation.service';
import dailyMenuService from '@services/daily-menu.service';
import restaurantService from '@services/restaurant.service';

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'menu'>('pedidos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isOpenRegisterAlmuerzo, setIsOpenRegisterAlmuerzo] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [menus, setMenus] = useState<any[]>([]);
  const [editingMenu, setEditingMenu] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    imagenPreview: '',
    price: 5.0,
    sopa: '',
    sopaExtras: '',
    proteina: '',
    guarniciones: '',
    ensalada: '',
    bebida: '',
    postre: '',
  });

  // Track if data has been loaded to prevent multiple calls
  const loadDataRef = React.useRef<boolean>(false);

  useEffect(() => {
    // Prevent multiple calls due to React StrictMode or other issues
    if (loadDataRef.current) {
      console.log('⚠️ [DASHBOARD] loadData already called, skipping to prevent infinite loop');
      return;
    }
    loadDataRef.current = true;

    console.log('🎯 [DASHBOARD] useEffect triggered, calling loadData...');
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📊 [DASHBOARD] Cargando datos...');
      console.log('📊 [DASHBOARD] localStorage keys:', Object.keys(localStorage));
      console.log('📊 [DASHBOARD] localStorage.restaurantId:', localStorage.getItem('restaurantId'));

      // Get restaurantId from localStorage (set during onboarding)
      let storedRestaurantId = localStorage.getItem('restaurantId');
      console.log('🔍 [DASHBOARD] storedRestaurantId retrieved:', storedRestaurantId);

      // If not in localStorage, try to fetch from backend
      if (!storedRestaurantId) {
        console.log('⚠️ [DASHBOARD] No restaurantId in localStorage, fetching from backend...');
        try {
          const restaurant = await restaurantService.getMyRestaurant();
          if (restaurant?.id) {
            storedRestaurantId = restaurant.id;
            localStorage.setItem('restaurantId', storedRestaurantId);
            console.log('✅ [DASHBOARD] restaurantId retrieved from backend and saved:', storedRestaurantId);
          }
        } catch (fetchErr) {
          console.log('ℹ️ [DASHBOARD] No restaurant found from backend');
        }
      }

      if (!storedRestaurantId) {
        console.error('❌ [DASHBOARD] No restaurant found');
        setError('No se encontró restaurante. Por favor, completa el onboarding.');
        setIsLoading(false);
        return;
      }

      console.log('✅ [DASHBOARD] Found restaurantId:', storedRestaurantId);
      setRestaurantId(storedRestaurantId);

      // Load reservations
      console.log('📥 [DASHBOARD] Fetching reservations...');
      try {
        const reservas = await reservationService.getAll();
        const resList = Array.isArray(reservas) ? reservas : [];
        setReservations(resList);
        console.log('✅ [DASHBOARD] Reservaciones cargadas:', resList.length, resList);
      } catch (resErr: any) {
        const resMsg = resErr?.response?.data?.message || resErr.message || 'Error cargando reservaciones';
        console.error('⚠️ [DASHBOARD] Error loading reservations:', resMsg);
        setReservations([]);
      }

      // Load daily menus from database
      console.log('📥 [DASHBOARD] Fetching menus for restaurantId:', storedRestaurantId);
      try {
        const loadedMenus = await dailyMenuService.getByRestaurant(storedRestaurantId);
        console.log('📦 [DASHBOARD] Raw menus response:', loadedMenus);

        if (Array.isArray(loadedMenus) && loadedMenus.length > 0) {
          // Transform backend format to frontend format
          const transformedMenus = loadedMenus.map((menu: any) => ({
            id: menu.id,
            nombre: menu.nombre,
            imagen: menu.imagen || '🍖',
            sopa: { nombre: menu.sopaName, extras: menu.sopaExtras },
            segundo: { proteina: menu.proteinaName, guarniciones: menu.guarniciones, ensalada: menu.ensalada },
            bebida: menu.bebida,
            postre: menu.postre,
            isActive: menu.isActive,
          }));
          setMenus(transformedMenus);
          console.log('✅ [DASHBOARD] Menús diarios cargados:', transformedMenus.length);
        } else {
          console.log('ℹ️ [DASHBOARD] No menus found for this restaurant');
          setMenus([]);
        }
      } catch (menuErr: any) {
        const menuMsg = menuErr?.response?.data?.message || menuErr.message || 'Error cargando menus';
        console.error('⚠️ [DASHBOARD] Error loading menus:', menuMsg);
        setMenus([]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error cargando datos';
      setError(msg);
      console.error('❌ [DASHBOARD] Outer error:', msg);
    } finally {
      console.log('✅ [DASHBOARD] loadData complete, isLoading set to false');
      setIsLoading(false);
    }
  };

  // ✅ ELIMINADO: handleSyncMenus ya no es necesario
  // Los menús se guardan directamente cuando se editan/crean en el modal
  // El estado de publicación (isActive) se controla desde el checkbox en el modal

  const handleDeleteMenu = async (menuId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas borrar este menú?')) {
      return;
    }

    setIsSaving(true);
    try {
      console.log('🗑️ [DASHBOARD] Borrando menú:', menuId);
      await dailyMenuService.delete(menuId);
      setMenus(menus.filter((m) => m.id !== menuId));
      setSuccess('✅ Menú borrado correctamente');
      setTimeout(() => setSuccess(null), 3000);
      console.log('✅ [DASHBOARD] Menú borrado');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error borrando menú';
      setError(msg);
      console.error('❌ [DASHBOARD] Error:', msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header showBackButton={true} backPath="/landing" />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // Show error if no restaurantId
  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header showBackButton={true} backPath="/landing" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <Alert variant="error" className="mb-4">
              ⚠️ No se encontró un restaurante asociado
            </Alert>
            <p className="text-gray-600 font-medium">
              Por favor, completa el onboarding de tu restaurante primero.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg transition"
            >
              → Ir a Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Separar reservaciones por estado
  const nuevos = reservations.filter(r => r.status === 'pending');
  const enCocina = reservations.filter(r => r.status === 'confirmed');
  const listos = reservations.filter(r => r.status === 'ready_for_pickup');

  // Dashboard navigation items
  const dashboardNavItems: DashboardNavItem[] = [
    {
      label: 'Tablero de Pedidos',
      icon: '📋',
      isActive: activeTab === 'pedidos',
      onClick: () => setActiveTab('pedidos'),
    },
    {
      label: 'Menú Diario',
      icon: '🍽️',
      isActive: activeTab === 'menu',
      onClick: () => setActiveTab('menu'),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBackButton={true} backPath="/landing" dashboardNav={dashboardNavItems} />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 bg-gradient-to-b from-white to-gray-50">
        <Container maxWidth="4xl">
          {error && (
            <Alert variant="error" className="mb-6">
              ⚠️ {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              {success}
            </Alert>
          )}

          {/* TABLERO KANBAN DE PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* COLUMNA 1: NUEVOS PEDIDOS */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    🔔 Nuevos Pedidos
                  </span>
                  <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {nuevos.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 min-h-[500px] bg-white">
                  {nuevos.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-8">
                      Sin pedidos en cola...
                    </p>
                  ) : (
                    nuevos.map((res) => (
                      <KanbanCard
                        key={res.id}
                        reservation={res}
                        onAction={() => console.log('Mover a cocina:', res.id)}
                        actionLabel="Preparar Orden"
                        actionColor="bg-red-600"
                      />
                    ))
                  )}
                </div>
              </div>

              {/* COLUMNA 2: EN COCINA */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-orange-600 text-white px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    🔥 En Cocina
                  </span>
                  <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {enCocina.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 min-h-[500px] bg-white">
                  {enCocina.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-8">
                      Sin pedidos en preparación...
                    </p>
                  ) : (
                    enCocina.map((res) => (
                      <KanbanCard
                        key={res.id}
                        reservation={res}
                        onAction={() => console.log('Mover a listo:', res.id)}
                        actionLabel="Marcar Listo"
                        actionColor="bg-orange-600"
                        status="cooking"
                      />
                    ))
                  )}
                </div>
              </div>

              {/* COLUMNA 3: LISTO PARA SERVIR */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-gray-700 text-white px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    ✓ Listo / Servir
                  </span>
                  <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {listos.length}
                  </span>
                </div>
                <div className="p-4 space-y-3 min-h-[500px] bg-white">
                  {listos.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-8">
                      No hay platos listos para despacho...
                    </p>
                  ) : (
                    listos.map((res) => (
                      <KanbanCard
                        key={res.id}
                        reservation={res}
                        onAction={() => console.log('Despachar:', res.id)}
                        actionLabel="Liberar Mesa"
                        actionColor="bg-gray-700"
                        status="ready"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB MENU - GESTIÓN DE MENÚ DIARIO */}
          {activeTab === 'menu' && (
            <div className="space-y-3">
              {/* Header con Título y Botón */}
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">📋 Menús del Día</h2>
                <button
                  onClick={() => setIsOpenRegisterAlmuerzo(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black py-2 px-4 rounded-lg uppercase tracking-wider transition transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                  <span className="text-lg">➕</span>
                  Registrar
                </button>
              </div>

              {/* Formulario Crear Menú Completo - HIDDEN */}
              <div className="hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    ➕ Registrar Nuevo Almuerzo
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Crea un menú completo para el día.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (formData.nombre.trim() && formData.sopa.trim()) {
                      setMenus([
                        ...menus,
                        {
                          id: `ALM-${new Date().getFullYear()}-${String(menus.length + 1).padStart(3, '0')}`,
                          nombre: formData.nombre,
                          imagen: formData.imagenPreview || '🍖',
                          sopa: { nombre: formData.sopa, extras: formData.sopaExtras },
                          segundo: { proteina: formData.proteina, guarniciones: formData.guarniciones, ensalada: formData.ensalada },
                          bebida: formData.bebida,
                          postre: formData.postre,
                          isActive: false,
                        },
                      ]);
                      setFormData({
                        nombre: '',
                        imagen: '',
                        imagenPreview: '',
                        sopa: '',
                        sopaExtras: '',
                        proteina: '',
                        guarniciones: '',
                        ensalada: '',
                        bebida: '',
                        postre: '',
                      });
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        Nombre del Menú
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej. Almuerzo de la Casa"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        📸 Foto del Almuerzo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                imagen: file.name,
                                imagenPreview: reader.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-red-600 bg-gray-50 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white"
                      />
                    </div>

                    {formData.imagenPreview && (
                      <div>
                        <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                          ✓ Vista Previa
                        </label>
                        <img
                          src={formData.imagenPreview}
                          alt="Preview"
                          className="w-full h-12 object-cover rounded-lg border-2 border-green-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🥣 Sopa
                      </label>
                      <input
                        type="text"
                        value={formData.sopa}
                        onChange={(e) => setFormData({ ...formData, sopa: e.target.value })}
                        placeholder="Ej. Sopa de camarón"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        Extras de Sopa
                      </label>
                      <input
                        type="text"
                        value={formData.sopaExtras}
                        onChange={(e) => setFormData({ ...formData, sopaExtras: e.target.value })}
                        placeholder="Ej. canguil, tostado"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🍖 Proteína
                      </label>
                      <input
                        type="text"
                        value={formData.proteina}
                        onChange={(e) => setFormData({ ...formData, proteina: e.target.value })}
                        placeholder="Ej. Seco de chivo"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🍚 Guarniciones
                      </label>
                      <input
                        type="text"
                        value={formData.guarniciones}
                        onChange={(e) => setFormData({ ...formData, guarniciones: e.target.value })}
                        placeholder="Ej. arroz, maduro"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🥗 Ensalada
                      </label>
                      <input
                        type="text"
                        value={formData.ensalada}
                        onChange={(e) => setFormData({ ...formData, ensalada: e.target.value })}
                        placeholder="Ej. cebolla y tomate"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🥤 Bebida
                      </label>
                      <input
                        type="text"
                        value={formData.bebida}
                        onChange={(e) => setFormData({ ...formData, bebida: e.target.value })}
                        placeholder="Ej. Jugo de maracuyá"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wide block mb-2">
                        🍮 Postre
                      </label>
                      <input
                        type="text"
                        value={formData.postre}
                        onChange={(e) => setFormData({ ...formData, postre: e.target.value })}
                        placeholder="Ej. Gelatina"
                        className="w-full text-xs p-3 rounded-lg border border-gray-200 font-semibold focus:outline-none focus:border-red-600 bg-gray-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition"
                  >
                    ➕ Crear Almuerzo Completo
                  </button>
                </form>
              </div>

              {/* Grid de Tarjetas de Almuerzos Completos */}
              {menus.length === 0 ? (
                <div className="text-center py-12 bg-white p-8 rounded-2xl border border-gray-200">
                  <p className="text-xs text-gray-400">No hay almuerzos registrados</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {menus.map((menu) => (
                      <div
                        key={menu.id}
                        className={`rounded-xl border-2 transition cursor-pointer overflow-hidden ${
                          menu.isActive
                            ? 'border-red-600 shadow-lg bg-red-50'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => {
                          setMenus(
                            menus.map((m) =>
                              m.id === menu.id ? { ...m, isActive: !m.isActive } : { ...m, isActive: false }
                            )
                          );
                        }}
                      >
                        {/* Imagen del Almuerzo */}
                        <div className="w-full h-28 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden">
                          {typeof menu.imagen === 'string' && menu.imagen.startsWith('data:') ? (
                            <img
                              src={menu.imagen}
                              alt={menu.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-5xl">{menu.imagen || '🍖'}</span>
                          )}
                        </div>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-2.5 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-wider line-clamp-1">{menu.nombre}</h4>
                            <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded">
                              ${menu.price?.toFixed(2) || '5.00'}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-red-100">{menu.id}</p>
                        </div>

                        {/* Contenido */}
                        <div className="p-2 space-y-1 text-xs">
                          {/* Sopa */}
                          <div className="border-b border-gray-100 pb-1">
                            <p className="font-black text-gray-600 uppercase tracking-wider text-[8px]">🥣 Sopa</p>
                            <p className="font-bold text-gray-900 mt-0.5 text-[10px] line-clamp-1">{menu.sopa.nombre}</p>
                            {menu.sopa.extras && (
                              <p className="text-gray-500 text-[9px] mt-0.5 line-clamp-1">Extras: {menu.sopa.extras}</p>
                            )}
                          </div>

                          {/* Segundo */}
                          <div className="border-b border-gray-100 pb-1">
                            <p className="font-black text-gray-600 uppercase tracking-wider text-[8px]">🍖 Segundo</p>
                            <div className="mt-0.5 space-y-0.5">
                              {menu.segundo.proteina && (
                                <p className="font-bold text-gray-900 text-[10px] line-clamp-1">
                                  {menu.segundo.proteina}
                                </p>
                              )}
                              {menu.segundo.guarniciones && (
                                <p className="text-gray-600 text-[9px] line-clamp-1">
                                  Acompañamientos: {menu.segundo.guarniciones}
                                </p>
                              )}
                              {menu.segundo.ensalada && (
                                <p className="text-gray-600 text-[9px] line-clamp-1">
                                  Ensalada: {menu.segundo.ensalada}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bebida y Postre */}
                          <div className="grid grid-cols-2 gap-1">
                            {menu.bebida && (
                              <div>
                                <p className="font-black text-gray-600 uppercase tracking-wider text-[8px]">🥤 Bebida</p>
                                <p className="font-bold text-gray-900 mt-0 text-[9px] line-clamp-1">{menu.bebida}</p>
                              </div>
                            )}
                            {menu.postre && (
                              <div>
                                <p className="font-black text-gray-600 uppercase tracking-wider text-[8px]">🍮 Postre</p>
                                <p className="font-bold text-gray-900 mt-0 text-[9px] line-clamp-1">{menu.postre}</p>
                              </div>
                            )}
                          </div>

                          {/* Estado de Publicación (solo lectura) */}
                          <div className="pt-2 border-t border-gray-100 space-y-1.5">
                            {/* ✅ BADGE VISUAL - Solo muestra estado, no es editable */}
                            <div
                              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md w-fit ${
                                menu.isActive
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              <span>{menu.isActive ? '✓' : '⊘'}</span>
                              <span>{menu.isActive ? 'Publicado' : 'No Publicado'}</span>
                            </div>

                            {/* Botones Editar y Borrar */}
                            <div className="flex gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('✎ [DASHBOARD] Abriendo edit modal para menú:', menu);
                                  setEditingMenu({
                                    id: menu.id,
                                    nombre: menu.nombre,
                                    imagen: menu.imagen,
                                    imagenPreview: menu.imagen,
                                    price: menu.price || 5.0,
                                    sopa: menu.sopa?.nombre || '',
                                    sopaExtras: menu.sopa?.extras || '',
                                    proteina: menu.segundo?.proteina || '',
                                    guarniciones: menu.segundo?.guarniciones || '',
                                    ensalada: menu.segundo?.ensalada || '',
                                    bebida: menu.bebida || '',
                                    postre: menu.postre || '',
                                    isActive: menu.isActive || false, // ✅ Pasar estado de publicación
                                  });
                                  console.log('✎ [DASHBOARD] editingMenu set, now opening modal');
                                  setIsEditMode(true);
                                  setIsOpenRegisterAlmuerzo(true);
                                }}
                                disabled={isSaving}
                                className="flex-1 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 text-[9px] font-bold py-1 px-2 rounded transition uppercase border border-gray-300"
                              >
                                ✎ Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMenu(menu.id);
                                }}
                                disabled={isSaving}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[9px] font-bold py-1 px-2 rounded transition uppercase"
                              >
                                ❌ Borrar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ✅ ELIMINADO: Botón Sincronizar ya no es necesario
                      Los menús se guardan directamente desde el modal */}
                </div>
              )}
            </div>
          )}
        </Container>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-200 text-center py-3 text-[11px] font-bold text-zinc-500 border-t border-zinc-300">
        Almuerza Ya SaaS Backend Engine v1.3.0 • MicLabs Tech 2026
      </footer>

      {/* MODAL REGISTRAR/EDITAR ALMUERZO */}
      <RegisterAlmuerzo
        isOpen={isOpenRegisterAlmuerzo}
        editingMenu={editingMenu}
        isEditing={isEditMode}
        onClose={() => {
          setIsOpenRegisterAlmuerzo(false);
          setEditingMenu(null);
          setIsEditMode(false);
        }}
        onSubmit={async (data) => {
          try {
            const menuPayload = {
              nombre: data.nombre,
              imagen: data.imagen,
              price: typeof data.price === 'string' ? parseFloat(data.price) : data.price, // ✅ Asegurar que sea número
              sopaName: data.sopa,
              sopaExtras: data.sopaExtras,
              proteinaName: data.proteina,
              guarniciones: data.guarniciones,
              ensalada: data.ensalada,
              bebida: data.bebida,
              postre: data.postre,
              isActive: data.isActive || false,
            };

            if (isEditMode && editingMenu?.id) {
              // EDITAR menú existente
              console.log('✎ [DASHBOARD] Editando menú:', editingMenu.id);
              await dailyMenuService.update(editingMenu.id, restaurantId, menuPayload);

              // Actualizar en UI
              setMenus(
                menus.map((m) =>
                  m.id === editingMenu.id
                    ? {
                        ...m,
                        nombre: data.nombre,
                        imagen: data.imagenPreview || data.imagen || m.imagen,
                        price: data.price,
                        sopa: { nombre: data.sopa, extras: data.sopaExtras },
                        segundo: { proteina: data.proteina, guarniciones: data.guarniciones, ensalada: data.ensalada },
                        bebida: data.bebida,
                        postre: data.postre,
                        isActive: data.isActive || false, // ✅ Actualizar estado de publicación
                      }
                    : m
                )
              );
              setSuccess('✅ Menú actualizado correctamente');
              console.log('✅ [DASHBOARD] Menú editado exitosamente');
            } else {
              // CREAR menú nuevo
              console.log('📝 [DASHBOARD] Creando nuevo menú:', data);

              if (restaurantId) {
                const createdMenu = await dailyMenuService.create(restaurantId, menuPayload);

                setMenus([
                  ...menus,
                  {
                    id: createdMenu.id,
                    nombre: createdMenu.nombre,
                    imagen: data.imagenPreview || createdMenu.imagen || '🍖',
                    price: createdMenu.price,
                    sopa: { nombre: createdMenu.sopaName, extras: createdMenu.sopaExtras },
                    segundo: { proteina: createdMenu.proteinaName, guarniciones: createdMenu.guarniciones, ensalada: createdMenu.ensalada },
                    bebida: createdMenu.bebida,
                    postre: createdMenu.postre,
                    isActive: createdMenu.isActive,
                  },
                ]);
                setSuccess('✅ Menú creado correctamente');
                console.log('✅ [DASHBOARD] Menú creado en BD');
              } else {
                setMenus([
                  ...menus,
                  {
                    id: `ALM-${new Date().getFullYear()}-${String(menus.length + 1).padStart(3, '0')}`,
                    nombre: data.nombre,
                    imagen: data.imagenPreview || '🍖',
                    price: data.price,
                    sopa: { nombre: data.sopa, extras: data.sopaExtras },
                    segundo: { proteina: data.proteina, guarniciones: data.guarniciones, ensalada: data.ensalada },
                    bebida: data.bebida,
                    postre: data.postre,
                    isActive: false,
                  },
                ]);
              }
            }

            setTimeout(() => setSuccess(null), 3000);
            setIsOpenRegisterAlmuerzo(false);
            setEditingMenu(null);
            setIsEditMode(false);
          } catch (err: any) {
            const msg = err?.response?.data?.message || err.message || 'Error guardando menú';
            setError(msg);
            console.error('❌ [DASHBOARD] Error:', msg);
          }
        }}
      />
    </div>
  );
};

/**
 * Componente de Tarjeta para Kanban
 */
interface KanbanCardProps {
  reservation: any;
  onAction: () => void;
  actionLabel: string;
  actionColor: string;
  status?: 'pending' | 'cooking' | 'ready';
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  reservation,
  onAction,
  actionLabel,
  actionColor,
  status = 'pending',
}) => {
  const items = reservation.items || [];
  const sopaItem = items.find((i: any) => i.category === 'Sopa');
  const segundoItem = items.find((i: any) => i.category === 'Segundo');

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-black text-zinc-900 text-sm">
            {reservation.user?.firstName || 'Cliente'} {reservation.user?.lastName || ''}
          </h4>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            {items.length}x Almuerzo Ejecutivo Completo
          </p>
        </div>
        <span className="text-[10px] bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded">
          Hace 2m
        </span>
      </div>

      {/* Items */}
      <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 text-[11px] font-semibold text-zinc-600 space-y-1">
        <p>
          <span className="text-zinc-400">Sopa:</span>{' '}
          <span>{sopaItem?.name || 'No seleccionado'}</span>
        </p>
        <p>
          <span className="text-zinc-400">Fuerte:</span>{' '}
          <span>{segundoItem?.name || 'No seleccionado'}</span>
        </p>
      </div>

      {/* Status Info */}
      {status === 'cooking' && (
        <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-2 rounded-lg text-[10px] font-black text-amber-800">
          <span>🚶 VIENE CAMINANDO (A 400m)</span>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-[10px] font-black text-emerald-800">
          <span>✓ ¡MESA MONTADA CORRECTAMENTE!</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs font-black bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded">
          💳 DeUna • ${reservation.totalAmount?.toFixed(2) || '0.00'}
        </span>
        <span className="text-[11px] text-zinc-400 font-bold">
          📍 A 850m
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className={`w-full ${actionColor} hover:opacity-90 text-white text-xs font-black py-2.5 rounded-lg transition uppercase tracking-tight flex items-center justify-center gap-2`}
      >
        {actionLabel} →
      </button>
    </div>
  );
};

export default RestaurantDashboard;
