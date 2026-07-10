-- Custom SQL migration file, put your code below! --
CREATE TRIGGER refresh_tokens_updated_at
BEFORE UPDATE ON refresh_tokens
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();