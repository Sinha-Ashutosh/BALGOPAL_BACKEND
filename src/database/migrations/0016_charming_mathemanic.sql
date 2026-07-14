-- Custom SQL migration file, put your code below! --
CREATE TRIGGER admissions_updated_at
BEFORE UPDATE ON admissions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();