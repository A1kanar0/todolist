import Button from './Button';

interface EditButtonProps {
    onClick: () => void;
    className?: string;
}

export default function EditButton({ onClick, className = '' }: EditButtonProps) {
    return (
        <Button
            variant="secondary"
            className={className}
            onClick={onClick}
        >
            Edit
        </Button>
    );
}
