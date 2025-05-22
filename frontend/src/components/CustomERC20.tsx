import useCustomERC20 from "../hooks/useCustomERC20";

export default function CustomERC20() {
  const { deploy } = useCustomERC20();

  const handleDeploy = async () => {
    await deploy();
  };

  return (
    <>
      <button
        className="py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={handleDeploy}
      >
        Deploy
      </button>
    </>
  );
}
