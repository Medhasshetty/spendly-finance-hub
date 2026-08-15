CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, type)
);

CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  category TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX transactions_date_idx ON public.transactions (date DESC);
CREATE INDEX transactions_type_idx ON public.transactions (type);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO anon, authenticated;
GRANT SELECT, INSERT ON public.categories TO anon, authenticated;
GRANT ALL ON public.transactions TO service_role;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read transactions" ON public.transactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add transactions" ON public.transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update transactions" ON public.transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete transactions" ON public.transactions FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add categories" ON public.categories FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (name, type) VALUES
  ('Food','expense'),('Travel','expense'),('Shopping','expense'),('Bills','expense'),
  ('Entertainment','expense'),('Healthcare','expense'),('Education','expense'),('Other','expense'),
  ('Salary','income'),('Freelance','income'),('Business','income'),('Investment','income'),('Other','income');

INSERT INTO public.transactions (type, category, amount, date, description) VALUES
  ('income','Salary',50000,'2026-03-01','March salary'),
  ('expense','Bills',7200,'2026-03-03','Rent and utilities'),
  ('expense','Food',4300,'2026-03-07','Groceries'),
  ('expense','Travel',1850,'2026-03-11','Cab rides'),
  ('expense','Shopping',3200,'2026-03-15','Clothing'),
  ('expense','Entertainment',900,'2026-03-19','Movie night'),
  ('income','Freelance',9000,'2026-03-22','Landing page project'),
  ('expense','Healthcare',1500,'2026-03-27','Pharmacy'),

  ('income','Salary',50000,'2026-04-01','April salary'),
  ('expense','Bills',7200,'2026-04-03','Rent and utilities'),
  ('expense','Food',5100,'2026-04-08','Groceries'),
  ('expense','Education',2500,'2026-04-12','Online course'),
  ('expense','Travel',2400,'2026-04-16','Weekend trip'),
  ('expense','Shopping',1800,'2026-04-21','Home supplies'),
  ('income','Investment',3200,'2026-04-25','Dividend payout'),
  ('expense','Entertainment',1200,'2026-04-28','Concert tickets'),

  ('income','Salary',50000,'2026-05-01','May salary'),
  ('expense','Bills',7400,'2026-05-04','Rent and utilities'),
  ('expense','Food',4700,'2026-05-09','Groceries'),
  ('expense','Healthcare',3100,'2026-05-13','Dental checkup'),
  ('expense','Travel',1600,'2026-05-18','Fuel'),
  ('income','Freelance',12000,'2026-05-20','Dashboard redesign'),
  ('expense','Shopping',2600,'2026-05-24','Electronics'),
  ('expense','Other',800,'2026-05-29','Misc'),

  ('income','Salary',52000,'2026-06-01','June salary'),
  ('expense','Bills',7400,'2026-06-03','Rent and utilities'),
  ('expense','Food',5300,'2026-06-08','Groceries'),
  ('expense','Entertainment',1400,'2026-06-12','Streaming and games'),
  ('expense','Travel',3900,'2026-06-17','Flight booking'),
  ('income','Business',8500,'2026-06-21','Consulting retainer'),
  ('expense','Education',1800,'2026-06-25','Books'),
  ('expense','Shopping',2100,'2026-06-29','Accessories'),

  ('income','Salary',52000,'2026-07-01','July salary'),
  ('expense','Bills',7600,'2026-07-03','Rent and utilities'),
  ('expense','Food',4900,'2026-07-07','Groceries'),
  ('expense','Healthcare',2200,'2026-07-11','Health checkup'),
  ('expense','Travel',2100,'2026-07-15','Cab rides'),
  ('income','Freelance',10500,'2026-07-19','Brand website'),
  ('expense','Shopping',3400,'2026-07-23','Footwear'),
  ('expense','Entertainment',1100,'2026-07-27','Dining out'),

  ('income','Salary',52000,'2026-08-01','August salary'),
  ('expense','Bills',7600,'2026-08-02','Rent and utilities'),
  ('expense','Education',3000,'2026-08-05','Certification fee'),
  ('expense','Travel',1450,'2026-08-09','Metro pass'),
  ('expense','Shopping',2750,'2026-08-11','Backpack'),
  ('income','Freelance',8000,'2026-08-14','Freelance payment'),
  ('expense','Food',500,'2026-08-15','Groceries');