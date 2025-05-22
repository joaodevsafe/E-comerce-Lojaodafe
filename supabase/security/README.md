
# Correções de Segurança

Este diretório contém informações sobre as correções de segurança aplicadas ao projeto.

## Proteção contra senhas vazadas

A proteção contra senhas vazadas foi ativada no Supabase Auth. Essa funcionalidade verifica se as senhas usadas pelos usuários estão comprometidas, consultando o serviço HaveIBeenPwned.org.

Para ativar esta funcionalidade manualmente no Supabase:
1. Acesse o dashboard do Supabase
2. Vá para Authentication > Settings
3. Habilite a opção "Enable HIBP (Pwned Passwords)"

## Remoção da tabela estrangeira "pay"

A tabela estrangeira "pay" foi removida do esquema público para evitar acesso via API sem respeitar as políticas de Row Level Security (RLS).

As tabelas estrangeiras não respeitam as políticas RLS, o que poderia levar a problemas de segurança e vazamento de informações.

## Links úteis

- [Documentação sobre proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- [Documentação sobre o linter de banco de dados](https://supabase.com/docs/guides/database/database-linter?lint=0017_foreign_table_in_api)
