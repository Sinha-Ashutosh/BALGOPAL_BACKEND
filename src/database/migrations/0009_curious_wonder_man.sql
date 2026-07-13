-- Custom SQL migration file, put your code below! --
CREATE TRIGGER website_settings_updated_at
BEFORE UPDATE ON website_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();