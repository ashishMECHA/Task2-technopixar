const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  icon,
  hint,
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`input-field appearance-none ${icon ? 'pl-10' : ''} pr-10 ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
};

export default FormSelect;
