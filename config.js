// إعدادات Supabase (القيمتين دول عامّتين وآمنين للنشر، الأمان بيتحكم فيه RLS في schema.sql).
// خدهم من Supabase → Project Settings → API:
//   supabaseUrl      = Project URL
//   supabaseAnonKey  = anon / publishable key   (مش الـ service_role أبداً!)
// سيبهم فاضيين = المنصة بتشتغل محلياً في المتصفح بدون تسجيل دخول.
window.NEXUS_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
