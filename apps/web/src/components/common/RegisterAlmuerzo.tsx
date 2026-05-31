import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';

interface AlmuerzoFormData {
  nombre: string;
  imagen: string;
  imagenPreview: string;
  price: number;
  sopa: string;
  sopaExtras: string;
  proteina: string;
  guarniciones: string;
  ensalada: string;
  bebida: string;
  postre: string;
  isActive?: boolean; // ✅ Nuevo: para publicar/no publicar
}

interface RegisterAlmuerzoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlmuerzoFormData) => void;
  editingMenu?: (AlmuerzoFormData & { id: string }) | null;
  isEditing?: boolean;
}

export const RegisterAlmuerzo: React.FC<RegisterAlmuerzoProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMenu,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<AlmuerzoFormData>({
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
    isActive: false, // ✅ No publicado por defecto
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-llenar formulario si es edición
  React.useEffect(() => {
    if (isEditing && editingMenu) {
      setFormData({
        nombre: editingMenu.nombre || '',
        imagen: editingMenu.imagen || '',
        imagenPreview: editingMenu.imagenPreview || '',
        price: editingMenu.price || 5.0,
        sopa: editingMenu.sopa || '',
        sopaExtras: editingMenu.sopaExtras || '',
        proteina: editingMenu.proteina || '',
        guarniciones: editingMenu.guarniciones || '',
        ensalada: editingMenu.ensalada || '',
        bebida: editingMenu.bebida || '',
        postre: editingMenu.postre || '',
        isActive: editingMenu.isActive || false, // ✅ Pre-llenar estado de publicación
      });
      setErrors({});
    }
  }, [isEditing, editingMenu, isOpen]);

  // ✅ VALIDACIÓN PROFESIONAL
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nombre del Menú (requerido, sin espacios en blanco)
    if (!formData.nombre || !formData.nombre.trim()) {
      newErrors.nombre = 'Nombre del menú requerido';
    }

    // PVP (requerido, número con máx 2 decimales)
    if (!formData.price || isNaN(formData.price)) {
      newErrors.price = 'PVP debe ser un número válido';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
      newErrors.price = 'PVP debe tener máximo 2 decimales (ej: 5.99)';
    }

    // Sopa (requerida, sin espacios en blanco)
    if (!formData.sopa || !formData.sopa.trim()) {
      newErrors.sopa = 'Nombre de la sopa requerido';
    }

    // Proteína (requerida, sin espacios en blanco)
    if (!formData.proteina || !formData.proteina.trim()) {
      newErrors.proteina = 'Proteína principal requerida';
    }

    // Guarniciones (requeridas, sin espacios en blanco)
    if (!formData.guarniciones || !formData.guarniciones.trim()) {
      newErrors.guarniciones = 'Guarniciones requeridas';
    }

    // Bebida (requerida, sin espacios en blanco)
    if (!formData.bebida || !formData.bebida.trim()) {
      newErrors.bebida = 'Bebida requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ LIMPIAR ERRORES AL ESCRIBIR
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'imagen' && files) {
      const file = files[0];
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
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // ✅ LIMPIAR ERROR cuando escribe
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 [REGISTER ALMUERZO] handleSubmit accionado');
    console.log('📝 [REGISTER ALMUERZO] isEditing:', isEditing);

    // ✅ VALIDAR FORMULARIO CON PATRÓN PROFESIONAL
    if (!validateForm()) {
      console.log('❌ [REGISTER ALMUERZO] Validación fallida');
      return;
    }

    console.log('✅ [REGISTER ALMUERZO] Validación exitosa, guardando...');
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
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
      isActive: false, // ✅ Reset a no publicado
    });
    setErrors({}); // ✅ Limpiar errores también
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? '✎ Editar Menú' : '📝 Registrar Menú'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <div className="border-b border-red-200 pb-3">
          <h3 className="text-xs font-black text-red-600 uppercase tracking-wider mb-2.5">
            📋 Información Básica del Menú
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {/* Nombre del Menú */}
            <div className="col-span-2">
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Nombre del Menú</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Casa"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
                  errors.nombre
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-red-600 focus:ring-red-100'
                }`}
              />
              {errors.nombre && <p className="text-xs text-red-600 font-bold mt-1">{errors.nombre}</p>}
            </div>

            {/* PVP */}
            <div className="col-span-1">
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">💵 PVP</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="5.00"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition text-right ${
                  errors.price
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-red-600 focus:ring-red-100'
                }`}
              />
              {errors.price && <p className="text-xs text-red-600 font-bold mt-1">{errors.price}</p>}
            </div>

            {/* Foto (Opcional) */}
            <div className="col-span-1">
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">📸 Foto</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-xs p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100 bg-white file:mr-1 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white transition"
              />
            </div>

            {formData.imagenPreview && (
              <div className="col-span-1">
                <label className="text-xs font-black text-green-600 uppercase block mb-1">✓ Vista</label>
                <img
                  src={formData.imagenPreview}
                  alt="Preview"
                  className="w-full h-10 object-cover rounded-lg border-2 border-green-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 2: SOPA */}
        <div className="border-b border-blue-200 pb-3">
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2.5">
            🥣 Sopa
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Nombre de la Sopa (Requerido) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Nombre de la Sopa</label>
              <input
                type="text"
                name="sopa"
                value={formData.sopa}
                onChange={handleChange}
                placeholder="Ej. De camarón"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
                  errors.sopa
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.sopa && <p className="text-xs text-red-600 font-bold mt-1">{errors.sopa}</p>}
            </div>
            {/* Extras de Sopa (Opcional) */}
            <div className="col-span-2">
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Extras (complementos)</label>
              <input
                type="text"
                name="sopaExtras"
                value={formData.sopaExtras}
                onChange={handleChange}
                placeholder="Ej. canguil, tostado"
                className="w-full text-xs p-2 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: SEGUNDO PLATO */}
        <div className="border-b border-orange-200 pb-3">
          <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2.5">
            🍖 Segundo Plato (Fuerte)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Proteína Principal (Requerida) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Proteína Principal</label>
              <input
                type="text"
                name="proteina"
                value={formData.proteina}
                onChange={handleChange}
                placeholder="Ej. Seco chivo"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
                  errors.proteina
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-orange-600 focus:ring-orange-100'
                }`}
              />
              {errors.proteina && <p className="text-xs text-red-600 font-bold mt-1">{errors.proteina}</p>}
            </div>
            {/* Guarniciones (Requeridas) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Guarniciones</label>
              <input
                type="text"
                name="guarniciones"
                value={formData.guarniciones}
                onChange={handleChange}
                placeholder="Ej. arroz, maduro"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
                  errors.guarniciones
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-orange-600 focus:ring-orange-100'
                }`}
              />
              {errors.guarniciones && <p className="text-xs text-red-600 font-bold mt-1">{errors.guarniciones}</p>}
            </div>
            {/* Ensalada (Opcional) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Ensalada</label>
              <input
                type="text"
                name="ensalada"
                value={formData.ensalada}
                onChange={handleChange}
                placeholder="Ej. cebolla tomate"
                className="w-full text-xs p-2 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-100 bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: COMPLEMENTOS */}
        <div className="pb-3">
          <h3 className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2.5">
            🥤 Complementos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Bebida (Requerida) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Bebida</label>
              <input
                type="text"
                name="bebida"
                value={formData.bebida}
                onChange={handleChange}
                placeholder="Ej. Jugo maracuyá"
                className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
                  errors.bebida
                    ? 'border-red-600 bg-red-50 focus:ring-red-100'
                    : 'border-gray-300 bg-white focus:border-purple-600 focus:ring-purple-100'
                }`}
              />
              {errors.bebida && <p className="text-xs text-red-600 font-bold mt-1">{errors.bebida}</p>}
            </div>
            {/* Postre (Opcional) */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase block mb-1">Postre</label>
              <input
                type="text"
                name="postre"
                value={formData.postre}
                onChange={handleChange}
                placeholder="Ej. Gelatina"
                className="w-full text-xs p-2 rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-100 bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 5: ESTADO DE PUBLICACIÓN */}
        <div className="border-b border-green-200 pb-3">
          <h3 className="text-xs font-black text-green-600 uppercase tracking-wider mb-2.5">
            📢 Estado de Publicación
          </h3>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-green-50 p-2 rounded-lg transition">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={(e) => {
                setFormData({ ...formData, isActive: e.target.checked });
                setErrors((prev) => ({ ...prev, isActive: '' }));
              }}
              className="w-5 h-5 rounded accent-green-600 cursor-pointer"
            />
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
                📌 {formData.isActive ? '✓ PUBLICADO' : '⊘ NO PUBLICADO'}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {formData.isActive
                  ? 'Este menú está visible en el Tablero de Pedidos'
                  : 'Este menú está oculto. Publícalo para que aparezca en el Tablero'}
              </p>
            </div>
          </label>
        </div>

        {/* BOTONES */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-xs uppercase rounded-lg transition border-2 border-gray-300"
          >
            ✕ Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xs uppercase rounded-lg transition shadow-lg flex items-center justify-center gap-1"
          >
            <span>✓</span>
            <span>{isEditing ? 'Guardar Cambios' : 'Crear Menú'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
