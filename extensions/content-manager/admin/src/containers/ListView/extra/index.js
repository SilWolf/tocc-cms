import { gameTabsWithComponent } from "./apis/game";

function extraTabsWithComponent({ slug }) {
  switch (slug) {
    case "application::game.game":
      console.log(gameTabsWithComponent);
      return gameTabsWithComponent;
  }

  return {};
}

export default extraTabsWithComponent;
