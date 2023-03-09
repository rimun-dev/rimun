export default function ProfileFeature(props: {
  name: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 p-4 ">
      <div className="font-bold text-xs uppercase col-span-1 text-slate-500">
        {props.name}
      </div>
      <div className="col-span-2 text-sm">{props.children ?? "N/A"}</div>
    </div>
  );
}
