import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Task/i});
  const inputDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: "Task 1"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(addButton);
  fireEvent.click(addButton); // Try to add the same task again

  const tasks = screen.getAllByText(/Task 1/i);
  expect(tasks.length).toBe(1); // There should be only one task
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(addButton);

  const task = screen.queryByText(/05\/30\/2023/i);
  expect(task).not.toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Task/i});
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: "Task 1"}});
  fireEvent.click(addButton);

  const task = screen.queryByText(/Task 1/i);
  expect(task).not.toBeInTheDocument();
});

test('test that App component can delete a task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Task/i});
  const inputDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: "Task 1"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(addButton);

  const taskCheckbox = screen.getByRole('checkbox');
  fireEvent.click(taskCheckbox);

  const task = screen.queryByText(/Task 1/i);
  expect(task).not.toBeInTheDocument();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Task/i});
  const inputDate = screen.getByLabelText(/Due Date/i);
  const addButton = screen.getByRole('button', {name: /Add/i});

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1); // Set date to yesterday

  fireEvent.change(inputTask, { target: { value: "Past Task"}});
  fireEvent.change(inputDate, { target: { value: pastDate.toLocaleDateString("en-US")}});
  fireEvent.click(addButton);

  const pastTaskCard = screen.getByTestId(/Past Task/i);
  expect(pastTaskCard).toHaveStyle('background-color: #ffcccc');
});
