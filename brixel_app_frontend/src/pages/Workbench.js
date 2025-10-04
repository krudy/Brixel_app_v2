import colors from "../lib/pallete";
import Workbench from "../components/Workbench/Workbench";

console.log("colors:", colors);

function WorkbenchPage() {
  return (
    <div>
      <Workbench colors={colors} />
    </div>
  );
}

export default WorkbenchPage;