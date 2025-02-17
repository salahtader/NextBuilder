import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import { arrayOutputType } from "zod";

const handleSubaccountRedirect = () => redirect("/subaccount");

const handleAgencyOwnerOrAdminRedirect = (agencyId: string, searchParams: { plan: any; state: { split: (arg0: string) => [string, string]; }; code: string; }) => {
  if (searchParams.plan) {
    return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
  }
  if (searchParams.state) {
    const [statePath, stateAgencyId] = searchParams.state.split("___");
    if (!stateAgencyId) return <div>Not authorized</div>;
    return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
  }
  return redirect(`/agency/${agencyId}`);
};

const handleNotAuthorized = () => <div>Not authorized</div>;

const Page = async ({ searchParams }:{searchParams:{
plan: string,
state : { split: (arg0: string) => [string, string]; },
code: string
}}) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (agencyId) {
    const user = await getAuthUserDetails();
    if (user) {
      const { role } = user;
      if (role === "SUBACCOUNT_GUEST" || role === "SUBACCOUNT_USER") {
        return handleSubaccountRedirect();
      } else if (role === "AGENCY_OWNER" || role === "AGENCY_ADMIN") {
        return handleAgencyOwnerOrAdminRedirect(agencyId, searchParams);
      } else {
        return handleNotAuthorized();
      }
    }
  }

  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }} />
      </div>
    </div>
  );
};

export default Page;









// import AgencyDetails from "@/components/forms/agency-details";
// import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
// import { currentUser } from "@clerk/nextjs/server";
// import { Plan } from "@prisma/client";
// import { redirect } from "next/navigation";

// const Page = async ({
//   searchParams,
// }: {
//   searchParams: { plan: Plan; state: string; code: string };
// }) => {
//   const agencyId = await verifyAndAcceptInvitation();

//   //get the users details
//   const user = await getAuthUserDetails();
//   if (agencyId) {
//     if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
//       return redirect("/subaccount");
//     } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
//       console.log(searchParams.plan)
//       if (searchParams.plan) {
      
//         return redirect(
//           `/agency/${agencyId}/billing?plan=${searchParams.plan}`
//         );
//       }
//       if (searchParams.state) {
//         const statePath = searchParams.state.split("___")[0];
//         const stateAgencyId = searchParams.state.split("___")[1];
//         if (!stateAgencyId) return <div>Not authorized</div>;
//         return redirect(
//           `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
//         );
//       } else return redirect(`/agency/${agencyId}`);
//     } else {
//       return <div>Not authorized</div>;
//     }
//   }

//   const authUser = await currentUser();
//   return (
// <div className="flex justify-center items-center mt-4">
//       <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
//         <h1 className="text-4xl"> Create An Agency</h1>
//         <AgencyDetails
//           data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
//         />
//         {/* <div>not authorized</div> */}
//       </div>
//     </div>
//   );
// };

// export default Page;
