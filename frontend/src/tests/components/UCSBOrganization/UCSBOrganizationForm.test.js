import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBOrganizationForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBOrganization", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization[0]} />
            </Router>
        );
        await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
        expect(screen.getByText(/orgCode/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue('ZPR');
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgCode");
	const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'ZPR' } });
	fireEvent.change(orgTranslationShortField, { target: { value: 'Zeta Phi Rho' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Zeta Phi Rho at UCSB' } });
        fireEvent.click(submitButton);

	expect(screen.queryByText(/orgTranslationShort must be a string/)).not.toBeInTheDocument();

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required./);
        expect(screen.getByText(/orgTranslationShort is required./)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required./)).toBeInTheDocument();
	expect(screen.getByText(/inactive is required./)).toBeInTheDocument();

    });


    test("Correct Error message if inactive is non-boolean", async () => {
        render(
            <Router>
                <UCSBOrganizationForm />
            </Router>
        );
    
        const inactiveField = await screen.findByTestId("UCSBOrganizationForm-inactive");
        
        fireEvent.change(inactiveField, { target: { value: 'invalid-input' } });
        
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
        fireEvent.click(submitButton);
    
        const errorMessage = await screen.findByText("Input needs to be just true or false");
        expect(errorMessage).toBeInTheDocument();
    });



    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBOrganizationForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgCode");

        const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
	const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'ZPR' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'Zeta Phi Rho' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Zeta Phi Rho at UCSB' } });
	fireEvent.change(inactiveField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/orgTranslationShort must be a string/)).not.toBeInTheDocument();
	expect(screen.queryByText(/orgTranslation must be a string/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});



