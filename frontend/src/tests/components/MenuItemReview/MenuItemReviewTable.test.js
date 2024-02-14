import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewTable tests", () => {
    const queryClient = new QueryClient();
  
    const expectedHeaders = ["id", "ItemId", "ReviewerEmail", "Stars", "Comments", "DateReviewed"];
    const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "comments", "dateReviewed"];
    const testId = "MenuItemReviewTable";
  
    test("renders empty table correctly", () => {
      
      // arrange
      const currentUser = currentUserFixtures.adminUser;
  
      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewTable menuItemReviews={[]} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(fieldElement).not.toBeInTheDocument();
      });
    });
  
    test("Has the expected column headers, content and buttons for admin user", () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;
  
      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("aqiu@umail.ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best and least dry roast beef ever! Yum!");
  
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("22");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("aqiu@ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("I love the tri-tip roast!");
      
      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("btn-primary");
  
      const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
  
    });
  
    test("Has the expected column headers, content for ordinary user", () => {
      // arrange
      const currentUser = currentUserFixtures.userOnly;
  
      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("aqiu@umail.ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best and least dry roast beef ever! Yum!");
  
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("22");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("aqiu@ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("I love the tri-tip roast!");
  
      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  
  
    test("Edit button navigates to the edit page", async () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;
  
      // act - render the component
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert - check that the expected content is rendered
      expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("aqiu@umail.ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best and least dry roast beef ever! Yum!");
  
      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
  
      // act - click the edit button
      fireEvent.click(editButton);
  
      // assert - check that the navigate function was called with the expected path
      await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/menuitemreviews/edit/2'));
  
    });
  
    test("Delete button calls delete callback", async () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;
  
      // act - render the component
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert - check that the expected content is rendered
      expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("aqiu@umail.ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("1111-11-11T11:11");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best and least dry roast beef ever! Yum!");
  
      const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).toBeInTheDocument();
  
      // act - click the delete button
      fireEvent.click(deleteButton);
    });
  });