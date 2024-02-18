import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("ArticleForm-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/articles", { params: { id: 1 } }).reply(200, {
                id: 1,          
                title: "Hi",
                url: "hello.com",
                explanation: "hello everyone",
                email: "hello@ucsb.edu",
                dateAdded: "2022-01-02T12:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "1",
                title: "omg",
                url: "omg.com",
                explanation: "omg everyone",
                email: "omg@ucsb.edu",
                dateAdded: "2022-11-02T12:00"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("1");
            expect(titleField).toHaveValue("Hi");
            expect(urlField).toHaveValue("hello.com");
            expect(explanationField).toHaveValue("hello everyone");
            expect(emailField).toHaveValue("hello@ucsb.edu");
            expect(dateAddedField).toHaveValue("2022-01-02T12:00");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("1");
            expect(titleField).toHaveValue("Hi");
            expect(urlField).toHaveValue("hello.com");
            expect(explanationField).toHaveValue("hello everyone");
            expect(emailField).toHaveValue("hello@ucsb.edu");
            expect(dateAddedField).toHaveValue("2022-01-02T12:00");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'omg' } });
            fireEvent.change(urlField, { target: { value: 'omg.com' } });
            fireEvent.change(explanationField, { target: { value: 'omg everyone' } });
            fireEvent.change(emailField, { target: { value: 'omg@ucsb.edu' } });
            fireEvent.change(dateAddedField, { target: { value: '2022-11-02T12:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 1 title: omg");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "omg",
                url: "omg.com",
                explanation: "omg everyone",
                email: "omg@ucsb.edu",
                dateAdded: "2022-11-02T12:00"
            })); // posted object

        });


    });
});