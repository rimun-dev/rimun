import { useField } from "formik";
import { HTMLProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import FieldItem from "src/components/fields/FieldItem";

interface MardownEditorFieldProps extends HTMLProps<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

export default function MardownEditorField(props: MardownEditorFieldProps) {
  const [field, { error, touched }] = useField<string>(props.name);

  return (
    <FieldItem {...{ error, touched }}>
      <div className="grid grid-cols-2 h-72 border rounded-lg overflow-hidden">
        <textarea
          {...props}
          {...field}
          className={`p-4 rounded-l-lg ${props.className}`}
          placeholder="Type here..."
        />
        <ReactMarkdown
          className="text-justify p-4 bg-slate-50 overflow-y-auto"
          rehypePlugins={[rehypeRaw]}
        >
          {field.value}
        </ReactMarkdown>
      </div>
    </FieldItem>
  );
}
