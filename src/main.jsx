import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import "./styles.css";

const templateData = [
  { id: 1, title: "Marketing Email Prompt", tags: ["marketing", "email"] },
  { id: 2, title: "Sales Call Script Prompt", tags: ["sales", "calls"] },
  { id: 3, title: "SEO Blog Outline Prompt", tags: ["seo", "blog"] },
  { id: 4, title: "Resume Improvement Prompt", tags: ["career", "resume"] },
  { id: 5, title: "Product Description Prompt", tags: ["ecommerce", "copy"] },
  { id: 6, title: "Research Summary Prompt", tags: ["research", "summary"] }
];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequired(value, fieldName) {
  if (!value || !value.trim()) return `${fieldName} обязательно`;
  return "";
}

function getTextError(value, fieldName, minLength = 3) {
  const required = validateRequired(value, fieldName);
  if (required) return required;
  if (value.trim().length < minLength) {
    return `${fieldName} должно быть не короче ${minLength} символов`;
  }
  return "";
}

function Nav() {
  return (
    <nav className="nav">
      <Link to="/">Главная</Link>
      <Link to="/auth/register">Регистрация</Link>
      <Link to="/auth/login">Вход</Link>
      <Link to="/auth/reset-password">Сброс</Link>
      <Link to="/editor">Редактор</Link>
      <Link to="/templates/create">Шаблон</Link>
      <Link to="/profile/settings">Профиль</Link>
      <Link to="/search">Поиск</Link>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="container">
      <h1>Сервис работы с промптами</h1>
      <Nav />
      <main>{children}</main>
    </div>
  );
}

function HomePage() {
  return (
    <Layout>
      <p>Демо-проект к домашнему заданию. Все формы валидируются, поиск работает через URL.</p>
    </Layout>
  );
}

function FormField({ label, name, value, onChange, error, type = "text", placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {error ? <small className="error">{error}</small> : null}
    </label>
  );
}

function RegisterPage() {
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      name: getTextError(form.name, "Имя", 2),
      email: validateEmail(form.email) ? "" : "Введите корректный email",
      password: getTextError(form.password, "Пароль", 6)
    };
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (!hasErrors) {
      setSuccess("Регистрация прошла успешно.");
    }
  }

  return (
    <Layout>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="card">
        <FormField label="Имя" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} type="email" />
        <FormField label="Пароль" name="password" value={form.password} onChange={handleChange} error={errors.password} type="password" />
        <button type="submit">Создать аккаунт</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function LoginPage() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email) ? "" : "Введите корректный email",
      password: getTextError(form.password, "Пароль", 6)
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setSuccess("Вход выполнен.");
    }
  }

  return (
    <Layout>
      <h2>Вход</h2>
      <form onSubmit={onSubmit} className="card">
        <FormField label="Email" name="email" value={form.email} onChange={onChange} error={errors.email} type="email" />
        <FormField label="Пароль" name="password" value={form.password} onChange={onChange} error={errors.password} type="password" />
        <button type="submit">Войти</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function ResetPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  function onSubmit(event) {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Введите корректный email");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Ссылка для сброса пароля отправлена.");
  }

  return (
    <Layout>
      <h2>Восстановление пароля</h2>
      <form onSubmit={onSubmit} className="card">
        <FormField
          label="Email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSuccess("");
          }}
          error={error}
          type="email"
          placeholder="name@example.com"
        />
        <button type="submit">Отправить</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function EditorPage() {
  const [form, setForm] = React.useState({ title: "", prompt: "" });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      title: getTextError(form.title, "Название", 4),
      prompt: getTextError(form.prompt, "Промпт", 12)
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setSuccess("Промпт сохранен.");
    }
  }

  return (
    <Layout>
      <h2>Редактор промптов</h2>
      <form onSubmit={onSubmit} className="card">
        <FormField label="Название" name="title" value={form.title} onChange={onChange} error={errors.title} />
        <label className="field">
          <span>Текст промпта</span>
          <textarea name="prompt" value={form.prompt} onChange={onChange} rows={7} />
          {errors.prompt ? <small className="error">{errors.prompt}</small> : null}
        </label>
        <button type="submit">Сохранить</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function CreateTemplatePage() {
  const [form, setForm] = React.useState({ name: "", category: "", content: "" });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      name: getTextError(form.name, "Название шаблона", 4),
      category: getTextError(form.category, "Категория", 3),
      content: getTextError(form.content, "Содержание", 10)
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setSuccess("Шаблон создан.");
    }
  }

  return (
    <Layout>
      <h2>Создание шаблона</h2>
      <form onSubmit={onSubmit} className="card">
        <FormField label="Название шаблона" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <FormField label="Категория" name="category" value={form.category} onChange={onChange} error={errors.category} />
        <label className="field">
          <span>Содержание</span>
          <textarea name="content" value={form.content} onChange={onChange} rows={6} />
          {errors.content ? <small className="error">{errors.content}</small> : null}
        </label>
        <button type="submit">Создать шаблон</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function ProfileSettingsPage() {
  const [form, setForm] = React.useState({ displayName: "", bio: "" });
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  }

  function onSubmit(event) {
    event.preventDefault();
    const nextErrors = {
      displayName: getTextError(form.displayName, "Имя отображения", 2),
      bio: getTextError(form.bio, "О себе", 10)
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      setSuccess("Настройки профиля обновлены.");
    }
  }

  return (
    <Layout>
      <h2>Настройки профиля</h2>
      <form onSubmit={onSubmit} className="card">
        <FormField
          label="Имя отображения"
          name="displayName"
          value={form.displayName}
          onChange={onChange}
          error={errors.displayName}
        />
        <label className="field">
          <span>О себе</span>
          <textarea name="bio" value={form.bio} onChange={onChange} rows={5} />
          {errors.bio ? <small className="error">{errors.bio}</small> : null}
        </label>
        <button type="submit">Сохранить изменения</button>
        {success ? <p className="success">{success}</p> : null}
      </form>
    </Layout>
  );
}

function SearchPage() {
  const navigate = useNavigate();
  const [term, setTerm] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [hint, setHint] = React.useState("");

  React.useEffect(() => {
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      setSuggestions([]);
      setHint("");
      return;
    }
    if (normalized.length < 3) {
      setSuggestions([]);
      setHint("Введите минимум 3 символа.");
      return;
    }
    setHint("Поиск подсказок...");
    const timeoutId = setTimeout(() => {
      const next = templateData.filter((item) =>
        item.title.toLowerCase().includes(normalized)
      );
      setSuggestions(next.slice(0, 5));
      setHint(next.length ? "" : "Подсказки не найдены.");
    }, 450);
    return () => clearTimeout(timeoutId);
  }, [term]);

  function onSubmit(event) {
    event.preventDefault();
    const normalized = term.trim();
    if (normalized.length < 3) {
      setHint("Для поиска нужно ввести минимум 3 символа.");
      return;
    }
    navigate(`/search/results?query=${encodeURIComponent(normalized)}`);
  }

  function onSuggestionClick(value) {
    navigate(`/search/results?query=${encodeURIComponent(value)}`);
  }

  return (
    <Layout>
      <h2>Поиск шаблонов</h2>
      <form className="card" onSubmit={onSubmit} method="get">
        <FormField
          label="Поисковый запрос"
          name="query"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          error=""
          placeholder="Введите минимум 3 символа"
        />
        <button type="submit">Найти</button>
        {hint ? <p>{hint}</p> : null}
        {suggestions.length > 0 ? (
          <ul className="suggestions">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onSuggestionClick(item.title)}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </form>
    </Layout>
  );
}

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").trim();

  const results = React.useMemo(() => {
    if (query.length < 3) return [];
    const normalized = query.toLowerCase();
    return templateData.filter((item) => {
      const titleMatched = item.title.toLowerCase().includes(normalized);
      const tagMatched = item.tags.some((tag) => tag.includes(normalized));
      return titleMatched || tagMatched;
    });
  }, [query]);

  return (
    <Layout>
      <h2>Результаты поиска</h2>
      <p>
        Текущий запрос: <b>{query || "не задан"}</b>
      </p>
      {query.length < 3 ? <p>Введите минимум 3 символа в параметре query.</p> : null}
      {query.length >= 3 && results.length === 0 ? <p>Ничего не найдено.</p> : null}
      {results.length > 0 ? (
        <ul className="results">
          {results.map((item) => (
            <li key={item.id}>
              <b>{item.title}</b>
              <p>Теги: {item.tags.join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <Link to="/search" className="link-button">
        Вернуться к поиску
      </Link>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/templates/create" element={<CreateTemplatePage />} />
        <Route path="/profile/settings" element={<ProfileSettingsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/results" element={<SearchResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
