import colors from "../lib/pallete";
import Workbench from "../components/Workbench/Workbench";

console.log("colors:", colors);

function WorkbenchPage() {
  return (
    <div>
      <h1>Workbench Page</h1>
      <Workbench colors={colors} />
    </div>
  );
}

export default WorkbenchPage;