import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (UCSBDiningCommonsMenuItem) => ({
    url: "/api/UCSBDiningCommonsMenuItem/post",
    method: "POST",
    params: {
      diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
      name: UCSBDiningCommonsMenuItem.name,
      station: UCSBDiningCommonsMenuItem.station
    }
  });

  const onSuccess = (ucsbDiningCommonsMenuItem) => {
    toast(`New ucsbDiningCommonsMenuItem Created - id: ${ucsbDiningCommonsMenuItem.id} name: ${ucsbDiningCommonsMenuItem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/UCSBDiningCommonsMenuItem/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBDiningCommonsMenuItem" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommonsMenuItem</h1>

        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}