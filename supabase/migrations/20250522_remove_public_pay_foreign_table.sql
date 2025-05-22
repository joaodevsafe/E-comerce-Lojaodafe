
-- Remover a tabela estrangeira "pay" do esquema público
DROP FOREIGN TABLE IF EXISTS public.pay;

-- Se for necessário manter essa tabela, devemos movê-la para um esquema privado não acessível pela API
-- CREATE SCHEMA IF NOT EXISTS private;
-- ALTER FOREIGN TABLE public.pay SET SCHEMA private;
