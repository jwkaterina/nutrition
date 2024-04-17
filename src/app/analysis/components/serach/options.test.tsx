import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Options from './options';

describe('options', () => {

    it('should render default options', () => {
        const props = {
            queryOptions: null,
            onclick: jest.fn()
        }
        
        render(<Options {...props} />);

        const lis = screen.getAllByRole('listitem');
        expect(lis).toHaveLength(3);
        expect(lis[0]).toHaveTextContent(/apple/i);
        expect(lis[1]).toHaveTextContent(/rice/i);
        expect(lis[2]).toHaveTextContent(/broccoli/i); 
    });

    it('should render given options', () => {
        const props = {
            queryOptions: ['wine', 'banana', 'chocolate'],
            onclick: jest.fn()
        }
        
        render(<Options {...props} />);

        const lis = screen.getAllByRole('listitem');
        expect(lis).toHaveLength(3);
        expect(lis[0]).toHaveTextContent(/wine/i);
        expect(lis[1]).toHaveTextContent(/banana/i);
        expect(lis[2]).toHaveTextContent(/chocolate/i); 
    });

});