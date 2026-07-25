import PageEditor from "@/components/cms/PageEditor";

export default function AboutPage() {
  return (
    <PageEditor
      slug="about"
      fields={[
        {
          key: "sectionLabel",
          label: "Section Label",
          type: "text",
        },
        {
          key: "heading",
          label: "Heading",
          type: "textarea",
        },
        {
          key: "paragraph1",
          label: "Paragraph 1",
          type: "textarea",
        },
        {
          key: "paragraph2",
          label: "Paragraph 2",
          type: "textarea",
        },
        {
          key: "marketedBy",
          label: "Marketed By",
          type: "textarea",
        },
        {
          key: "sourcedFrom",
          label: "Sourced From",
          type: "text",
        },
        {
          key: "packagedIn",
          label: "Packaged In",
          type: "text",
        },
        {
          key: "batchNumber",
          label: "Batch Number",
          type: "text",
        },
        {
          key: "manufactured",
          label: "Manufactured",
          type: "text",
        },
        {
          key: "expires",
          label: "Expires",
          type: "text",
        },
      ]}
    />
  );
}