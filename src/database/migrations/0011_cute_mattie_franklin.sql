-- Custom SQL migration file, put your code below! --
CREATE TRIGGER gallery_updated_at
BEFORE UPDATE ON gallery
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();