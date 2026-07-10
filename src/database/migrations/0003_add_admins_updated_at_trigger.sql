-- Custom SQL migration file, put your code below! --
CREATE TRIGGER admins_updated_at
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();