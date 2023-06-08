import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./cardScreen.css";
import { CardProps } from "../../Components/Cards/Card";
import CardComponent from "../../Components/Cards/Card";
import ResponsiveAppBar from "../../Components/Navbar/Navbar";
import { DataSnapshot, update } from "firebase/database";
import getCurrentCard from "./cardScreenUtils";
import EditCardForm from "../../Components/editCardForm/editCard";

export default function CardScreen() {
  const [currentCard, setCurrentCard] = useState<CardProps>();
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const location = useLocation();
  const currentUrl = location.pathname;
  const postKey = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

  function updateCurrentCard(cardTpUpdate: CardProps) {
    setCurrentCard(() => cardTpUpdate);
  }

  function editEntry() {
    setIsFormVisible(true);
  }

  function closeForm() {
    setIsFormVisible(false);
  }

  useEffect(() => {
    getCurrentCard(postKey).then((snapshot: DataSnapshot) => {
      const data = snapshot.val();

      console.log(data);

      const currentCardInfo: CardProps = {
        title: data.cardTitle,
        description: data.cardDescription,
        imageUrl: data.cardImage,
      };

      updateCurrentCard(currentCardInfo);
    });
  }, [postKey]);

  return (
    <div className="container-xxl" id="singleCardScreen">
      <ResponsiveAppBar />
      <div className="currentCardOnScreen container-xxl">
        {currentCard && (
          <>
            <CardComponent
              postKey={postKey}
              title={currentCard.title} // Provide appropriate values for title, description, and imageUrl
              description={currentCard.description}
              imageUrl={currentCard.imageUrl}
              key={0}
            />

            <EditCardForm
              visibility={isFormVisible}
              onClose={closeForm}
              cardOnDisplay={currentCard}
              postKey={postKey}
              updateCard={updateCurrentCard}
            />

            <div className="buttonContainer">
              <button
                type="button"
                className="btn btn-lg btn-primary"
                onClick={editEntry}
              >
                Edit
              </button>
              <button type="button" className="btn btn-lg btn-danger">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
