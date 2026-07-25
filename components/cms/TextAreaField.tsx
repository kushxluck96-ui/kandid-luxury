type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextAreaField({
  label,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {label}
      </label>

      <textarea
        rows={6}
        className="w-full rounded-xl border p-4"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}