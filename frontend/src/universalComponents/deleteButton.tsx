import React from "react";

interface DeleteButtonProps {
    onDelete: () => void;
    id: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, id }) => {

    const handleDelete = async() => {
        try {
            const response =await fetch(`http://localhost:5001/api/products/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })

            
            });

            if (response.ok) {
                // Szólunk a szülő komponensnek (a táblázatnak), hogy frissítse a képernyőt!
                onDelete(); 
            } else {
                console.error("A szerver hibát dobott a törlésnél.");
            }

        } catch (error) {
            console.error("Hiba történt a termék törlésekor:", error);
        }
    };

    return (
        <button onClick={handleDelete} className="delete-button">
            Törlés
        </button>
    );
};

export default DeleteButton;