import { useState } from "react";
/**
 * @hook useDisclosure
 *
 * useDisclosure is a custom React hook that aids in controlling the open/closed states
 * of UI components such as Modals, Drawers, Dialogs etc. The hook provides an `isOpen`
 * state variable, and functions to toggle this state (`onToggle`), explicitly open
 * (`onOpen`) or close (`onClose`).
 *
 * By encapsulating these common requirements in a custom hook, we can maintain cleaner
 * and more consistent state management across our components.
 *
 * @returns {Object} Disclosure helpers including:
 *  isOpen {boolean} - whether the component should currently be open or closed.
 *  onToggle {function} - function to toggle the open/closed state.
 *  onOpen {function} - function to explicitly set the state to open.
 *  onClose {function} - function to explicitly set the state to closed.
 *
 * @example
 * const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
 *
 * <SomeModalComponent isOpen={isOpen} onClose={onClose}>
 *   <button onClick={onToggle}>Toggle Modal</button>
 * </SomeModalComponent>
 *
 * @author Mark Dave Soriano - Innoendo
 */

export interface IUseDisclosure {
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}
const useDisclosure = (): IUseDisclosure => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onToggle, onOpen, onClose };
};

export default useDisclosure;
