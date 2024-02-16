import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemId: 1,
                reviewerEmail: "aqiu@ucsb.edu",
                stars: 1,
                comments: "yum",
                dateReviewed: "1111-11-11T11:11",
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: "17",
                itemId: "5",
                reviewerEmail: "aqiu@umail.ucsb.edu",
                stars: "4",
                comments: "yummy",
                dateReviewed: "2020-11-11T11:11",
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            expect(idField).toBeInTheDocument();

            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            expect(itemIdField).toBeInTheDocument();

            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            expect(reviewerEmailField).toBeInTheDocument();

            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            expect(starsField).toBeInTheDocument();

            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            expect(dateReviewedField).toBeInTheDocument();

            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            expect(commentsField).toBeInTheDocument();

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
            expect(submitButton).toBeInTheDocument();

            

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(1);
            expect(reviewerEmailField).toHaveValue("aqiu@ucsb.edu");
            expect(starsField).toHaveValue(1);
            expect(dateReviewedField).toHaveValue("1111-11-11T11:11");
            expect(commentsField).toHaveValue("yum")

        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(1);
            expect(reviewerEmailField).toHaveValue("aqiu@ucsb.edu");
            expect(starsField).toHaveValue(1);
            expect(dateReviewedField).toHaveValue("1111-11-11T11:11");
            expect(commentsField).toHaveValue("yum");

            fireEvent.change(itemIdField, { target: { value: '5' } })
            fireEvent.change(starsField, { target: { value: '4' } })
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 17 itemId: 5 stars: 4");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
        
            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "5",
                reviewerEmail: "aqiu@ucsb.edu",
                stars: "4",
                dateReviewed: "1111-11-11T11:11",
                comments: "yum",
            }));
        });

       
    });
});


