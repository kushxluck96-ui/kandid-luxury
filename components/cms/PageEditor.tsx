"use client";

import { useState, useEffect } from "react";
import { usePage } from "@/hooks/usePage";

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea";
};

type Props = {
  slug: string;
  fields: Field[];
};

import TextField from "./TextField";
import TextAreaField from "./TextAreaField";

export default function PageEditor({
  slug,
  fields,
}: Props) {
  const { page, loading, save } = usePage(slug);

  const [content, setContent] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setContent(page.content || {});
    }
  }, [page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleSave() {
    setSaving(true);

    await save(content);

    setSaving(false);

    alert("Saved!");
  }

  return (
    <div className="space-y-8">

      {fields.map((field) => {

        if (field.type === "text") {
          return (
            <TextField
              key={field.key}
              label={field.label}
              value={content[field.key]}
              onChange={(value) =>
                setContent({
                  ...content,
                  [field.key]: value,
                })
              }
            />
          );
        }

        return (
          <TextAreaField
            key={field.key}
            label={field.label}
            value={content[field.key]}
            onChange={(value) =>
              setContent({
                ...content,
                [field.key]: value,
              })
            }
          />
        );
      })}

      <button
        onClick={handleSave}
        className="rounded-xl bg-black px-8 py-4 text-white"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}