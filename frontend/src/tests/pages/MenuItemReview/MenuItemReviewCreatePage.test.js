import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {

        const queryClient = new QueryClient();
        const menuItemReview = {
            id: 3,
            itemId: 1,
            reviewerEmail: "aqiu@ucsb.edu",
            stars: 1,
            comments: "yum",
            dateReviewed: "11-11-1111T11:11",
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuItemReview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByTestId("MenuItemReviewForm-itemId");
        expect(itemIdInput).toBeInTheDocument();

        const reviewerEmailInput = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        expect(reviewerEmailInput).toBeInTheDocument();

        const starsInput = screen.getByTestId("MenuItemReviewForm-stars");
        expect(starsInput).toBeInTheDocument();

        const dateReviewedInput = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        expect(dateReviewedInput).toBeInTheDocument();

        const commentsInput = screen.getByTestId("MenuItemReviewForm-comments");
        expect(commentsInput).toBeInTheDocument();

        const createButton = screen.getByTestId("MenuItemReviewForm-submit");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: '1' } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'aqiu@ucsb.edu' } })
        fireEvent.change(starsInput, { target: { value: '1' } })
        fireEvent.change(dateReviewedInput, { target: { value: '1111-11-11T11:11' } })
        fireEvent.change(commentsInput, { target: { value: 'yum' } })
        fireEvent.click(createButton);      
        
        console.log(axiosMock.history.post)

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "itemId": "1",
            "reviewerEmail": "aqiu@ucsb.edu",
            "stars": "1",
            "dateReviewed": "1111-11-11T11:11",
            "comments": "yum"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New menuItemReview Created - id: 3 itemId: 1 stars: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

    });
});


