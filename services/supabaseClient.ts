
import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const SUPABASE_URL = 'https://adkulstcretguqsfqpht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka3Vsc3RjcmV0Z3Vxc2ZxcGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTA0ODcsImV4cCI6MjA2NzQyNjQ4N30.Tnonh49OCVHsUR1OjyE5D1GEvfY1VAWFJLblYbuaU1U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Busca un producto en la tabla 'productos' utilizando el esquema exacto:
 * Columnas: "Producto", "Codigo", "Codigo1", "Codigo2", "Codigo3", "Codigo4", "Precio"
 */
export const getProductByCode = async (code: string): Promise<Product | null> => {
  try {
    // Realizamos una búsqueda en todas las columnas de código posibles usando .or()
    // Nota: Las columnas en PostgreSQL con mayúsculas requieren atención al nombre exacto.
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .or(`Codigo.eq.${code},Codigo1.eq.${code},Codigo2.eq.${code},Codigo3.eq.${code},Codigo4.eq.${code}`)
      .maybeSingle();

    if (error) {
      console.error('Error de Supabase:', error.message);
      throw error;
    }

    if (!data) return null;

    // Mapeamos los campos del esquema ("Producto", "Precio", "Codigo") a nuestra interfaz Product
    return {
      id: String(data.id),
      code: data.Codigo || code,
      name: data.Producto || 'Producto sin nombre',
      price: parseFloat(data.Precio || 0),
      description: '', // El esquema no incluye descripción explícita
      category: 'General',
      image_url: '', // El esquema no incluye imagen
      stock: 0
    };
  } catch (err: any) {
    const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error('Error detallado en getProductByCode:', message);
    throw err;
  }
};
