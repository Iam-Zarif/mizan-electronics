
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 cursor-pointer font-semibold transition ${
        active
          ? "border-b-2 border-indigo-600 text-indigo-600"
          : "text-neutral-500 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

type ProductTab = "desc" | "reviews" | "qa";

type TablistProps = {
  tab: ProductTab;
  setTab: React.Dispatch<React.SetStateAction<ProductTab>>;
};

const Tablist = ({ setTab, tab }: TablistProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 border-b">
      <TabButton
        active={tab === "desc"}
        onClick={() => setTab("desc")}
        label="Description"
      />
      <TabButton
        active={tab === "reviews"}
        onClick={() => setTab("reviews")}
        label="Reviews"
      />
      <TabButton
        active={tab === "qa"}
        onClick={() => setTab("qa")}
        label="Questions"
      />
    </div>
  );
};

export default Tablist;
