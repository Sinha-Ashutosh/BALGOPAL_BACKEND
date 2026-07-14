-- Custom SQL migration file, put your code below! --
CREATE TRIGGER testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();