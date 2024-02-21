import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/requester Email/);
        await screen.findByText(/professor Email/);
        await screen.findByText(/explanation/);
        await screen.findByText(/date Requested/);
        await screen.findByText(/date Needed/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendation} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/requester Email is required./);
        expect(screen.getByText(/requester Email must be valid./)).toBeInTheDocument();
        expect(screen.getByText(/professor Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/professor Email must be valid./)).toBeInTheDocument();
        expect(screen.getByText(/date Requested is required in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/date Needed is required in ISO format./)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/requester Email is required./);
        expect(screen.getByText(/professor Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/date Requested is required in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/date Needed is required in ISO format./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'student@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'professor@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'need letter of rec' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-01-03T12:00' } });
        fireEvent.click(doneField);
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/requester Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/requester Email must be valid./)).not.toBeInTheDocument();
        expect(screen.queryByText(/professor Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/professor Email must be valid./)).not.toBeInTheDocument();
        expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/date Requested is required in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/date Needed is required in ISO format./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


