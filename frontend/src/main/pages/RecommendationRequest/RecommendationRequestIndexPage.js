import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from 'main/components/RecommendationRequest/RecommendationRequestTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function RecommendationRequestIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/RecommendationRequest/create"
                style={{ float: "right" }}
            >
                Create RecommendationRequest 
            </Button>
        )
    } 
  }
  
  const { data: RecommendationRequests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/RecommendationRequest/all"],
      { method: "GET", url: "/api/RecommendationRequest/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>RecommendationRequests</h1>
        <RecommendationRequestTable RecommendationRequests={RecommendationRequests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}