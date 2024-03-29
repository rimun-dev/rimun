import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminHallOfFame from "src/pages/dashboard/person/admin/hall-of-fame";
import AdminProfiles from "src/pages/dashboard/person/admin/profiles";
import AdminPersonProfile from "src/pages/dashboard/person/admin/profiles/PersonProfile";
import AdminSchoolProfile from "src/pages/dashboard/person/admin/profiles/SchoolProfile";
import Landing from "src/pages/landing";
import LandingBlog from "src/pages/landing/blog";
import LandingConferenceFaq from "src/pages/landing/conference/faq";
import LandingConferenceForums from "src/pages/landing/conference/forums";
import LandingConferenceHallOfFame from "src/pages/landing/conference/hall-of-fame";
import LandingConferenceResources from "src/pages/landing/conference/resources";
import LandingConferenceTeam from "src/pages/landing/conference/team";
import LandingConferenceTheme from "src/pages/landing/conference/theme";
import LandingContact from "src/pages/landing/contact";
import LandingCookies from "src/pages/landing/cookies";
import LandingGallery from "src/pages/landing/gallery";
import AlbumFocus from "src/pages/landing/gallery/AlbumFocus";
import LandingHome from "src/pages/landing/home";
import LandingTerms from "src/pages/landing/terms";
import AlertPopup from "./components/singletons/AlertPopup";
import NewsFeed from "./components/singletons/NewsFeed";
import NotFound from "./components/singletons/NotFound";
import { API_ENDPOINT } from "./config";
import PersonDashboard from "./pages/dashboard/person";
import PersonAdmin from "./pages/dashboard/person/admin";
import AdminPanel from "./pages/dashboard/person/admin/AdminPanel";
import AdminApplications from "./pages/dashboard/person/admin/applications";
import AdminCommittees from "./pages/dashboard/person/admin/committees";
import CommitteeFocus from "./pages/dashboard/person/admin/committees/CommitteeFocus";
import CommitteesOverview from "./pages/dashboard/person/admin/committees/CommitteesOverview";
import AdminDelegations from "./pages/dashboard/person/admin/delegations";
import DelegationFocus from "./pages/dashboard/person/admin/delegations/DelegationFocus";
import DelegationsOverview from "./pages/dashboard/person/admin/delegations/DelegationsOverview";
import AdminDirectors from "./pages/dashboard/person/admin/directors";
import AdminDocuments from "./pages/dashboard/person/admin/documents";
import AdminExports from "./pages/dashboard/person/admin/exports";
import AdminFaqs from "./pages/dashboard/person/admin/faqs";
import AdminGallery from "./pages/dashboard/person/admin/gallery";
import AdminHousing from "./pages/dashboard/person/admin/housing";
import AdminPermissions from "./pages/dashboard/person/admin/permissions";
import AdminSearch from "./pages/dashboard/person/admin/search";
import AdminTeam from "./pages/dashboard/person/admin/team";
import PersonApplication from "./pages/dashboard/person/application";
import HighSchoolApplication from "./pages/dashboard/person/application/HighSchoolApplication";
import PersonApplicationChoice from "./pages/dashboard/person/application/PersonApplicationChoice";
import UndergraduateApplication from "./pages/dashboard/person/application/UndergraduateApplication";
import PersonSettings from "./pages/dashboard/person/settings";
import SchoolDashboard from "./pages/dashboard/school";
import SchoolApplication from "./pages/dashboard/school/application";
import SchoolDelegations from "./pages/dashboard/school/delegations";
import SchoolDelegationFocus from "./pages/dashboard/school/delegations/Focus";
import SchoolDelegationsOverview from "./pages/dashboard/school/delegations/Overview";
import SchoolSettings from "./pages/dashboard/school/settings";
import SchoolStudents from "./pages/dashboard/school/students";
import SchoolTeachers from "./pages/dashboard/school/teachers";
import Login from "./pages/login";
import PasswordRecovery from "./pages/password-recovery";
import PasswordReset from "./pages/password-reset";
import Registration from "./pages/registration";
import PersonRegistration from "./pages/registration/PersonRegistration";
import SchoolRegistration from "./pages/registration/SchoolRegistration";
import { store, useStateSelector } from "./store";
import { DeviceActions } from "./store/reducers/device";
import { createTrpcClient, trpc } from "./trpc";

const handleError = (err: unknown) => {
  console.debug(err);
  if (!(err instanceof TRPCClientError)) return;
  const message = !!err.message
    ? err.message.replace("TRPCClientError: ", "")
    : "Something wrong happened, please try again later.";
  store.dispatch(
    DeviceActions.displayAlert({
      status: "error",
      message,
    })
  );
};

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export default function App() {
  const authState = useStateSelector((state) => state.auth);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleError,
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            onError: handleError,
          },

          mutations: {
            onError: handleError,
          },
        },
      })
  );
  const [trpcClient] = React.useState(() => createTrpcClient(API_ENDPOINT));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <AlertPopup />

        <Routes>
          <Route path="/" element={<Landing />}>
            <Route index element={<LandingHome />} />
            <Route path="conference">
              <Route path="theme" element={<LandingConferenceTheme />} />
              <Route path="team" element={<LandingConferenceTeam />} />
              <Route
                path="resources"
                element={<LandingConferenceResources />}
              />
              <Route path="faq" element={<LandingConferenceFaq />} />
              <Route
                path="forums/:acronym"
                element={<LandingConferenceForums />}
              />
              <Route
                path="hall-of-fame"
                element={<LandingConferenceHallOfFame />}
              />
            </Route>

            <Route path="gallery">
              <Route index element={<LandingGallery />} />
              <Route path="albums/:edition" element={<AlbumFocus />} />
            </Route>
            <Route path="blog" element={<LandingBlog />} />
            <Route path="contact" element={<LandingContact />} />
            <Route path="cookies" element={<LandingCookies />} />
            <Route path="terms" element={<LandingTerms />} />
          </Route>
          {authState.isAuthenticated ? (
            !authState.account.is_school ? (
              <Route path="/dashboard" element={<PersonDashboard />}>
                <Route path="news" element={<NewsFeed />} />
                <Route path="application" element={<PersonApplication />}>
                  <Route index element={<PersonApplicationChoice />} />
                  <Route
                    path="high-school"
                    element={<HighSchoolApplication />}
                  />
                  <Route
                    path="undergraduate"
                    element={<UndergraduateApplication />}
                  />
                </Route>
                <Route path="admin" element={<PersonAdmin />}>
                  <Route index element={<AdminPanel />} />
                  <Route path="search" element={<AdminSearch />} />
                  <Route path="applications" element={<AdminApplications />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="directors" element={<AdminDirectors />} />
                  <Route path="documents" element={<AdminDocuments />} />
                  <Route path="faqs" element={<AdminFaqs />} />
                  <Route path="permissions" element={<AdminPermissions />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="housing" element={<AdminHousing />} />
                  <Route path="hall-of-fame" element={<AdminHallOfFame />} />
                  <Route path="exports" element={<AdminExports />} />
                  <Route path="committees" element={<AdminCommittees />}>
                    <Route index element={<CommitteesOverview />} />
                    <Route path=":id" element={<CommitteeFocus />} />
                  </Route>
                  <Route path="delegations" element={<AdminDelegations />}>
                    <Route index element={<DelegationsOverview />} />
                    <Route path=":id" element={<DelegationFocus />} />
                  </Route>
                  <Route path="profiles" element={<AdminProfiles />}>
                    <Route path="school/:id" element={<AdminSchoolProfile />} />
                    <Route path="person/:id" element={<AdminPersonProfile />} />
                  </Route>
                </Route>
                <Route path="settings" element={<PersonSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            ) : (
              <Route path="/dashboard" element={<SchoolDashboard />}>
                <Route path="news" element={<NewsFeed />} />
                <Route path="application" element={<SchoolApplication />} />
                <Route path="students" element={<SchoolStudents />} />
                <Route path="teachers" element={<SchoolTeachers />} />
                <Route path="delegations" element={<SchoolDelegations />}>
                  <Route index element={<SchoolDelegationsOverview />} />
                  <Route path=":id" element={<SchoolDelegationFocus />} />
                </Route>
                <Route path="settings" element={<SchoolSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            )
          ) : (
            <>
              <Route path="/registration" element={<Registration />} />
              <Route
                path="/registration/person"
                element={<PersonRegistration />}
              />
              <Route
                path="/registration/school"
                element={<SchoolRegistration />}
              />
              <Route
                path="/registration/school-network"
                element={<SchoolRegistration isNetwork />}
              />
              <Route path="/password-recovery" element={<PasswordRecovery />} />
              <Route
                path="/password-recovery/:token"
                element={<PasswordReset />}
              />
              <Route path="/*" element={<Login />} />
            </>
          )}
        </Routes>
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
}
