import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

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

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();
    
    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create MenuItemReview/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create MenuItemReview/);
        expect(button).toHaveAttribute("href", "/menuitemreview/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three menuitemreviews correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, menuItemReviewFixtures.threeMenuItemReviews);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

        const createMenuItemReviewButton = screen.queryByText("Create MenuItemReview");
        expect(createMenuItemReviewButton).not.toBeInTheDocument();

        const itemId = screen.getByText("11");
        expect(itemId).toBeInTheDocument();

        const reviewerEmail = screen.getByText("aqiu@ucsb.edu");
        expect(reviewerEmail).toBeInTheDocument();

        const stars = screen.getAllByText("5");
        expect(stars.length).toBe(2);

        const dateReviewed = screen.getAllByText("1111-11-11T11:11")
        expect(dateReviewed.length).toBe(3);

        const comments = screen.getByText("I love the tri-tip roast!");
        expect(comments).toBeInTheDocument();
        

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/menuitemreview/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/menuitemreviews/all");
        restoreConsole();

    });
});


