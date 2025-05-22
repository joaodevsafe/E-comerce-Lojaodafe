
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Esta função será executada no deploy para habilitar a proteção contra senhas vazadas
Deno.serve(async (req) => {
  try {
    // Criar um cliente admin do Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Chamar a API de administração para ativar a proteção contra senhas vazadas
    const { error } = await supabaseAdmin.functions.invoke('auth-enable-leaked-password-protection', {
      method: 'POST',
      body: { enabled: true }
    })

    if (error) throw error

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Proteção contra senhas vazadas ativada com sucesso!' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
