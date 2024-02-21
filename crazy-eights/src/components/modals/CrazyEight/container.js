import { CrazyEightPres } from "./Pres"

export const CrazyEightContainer = ({
    isSpecialCardSelected,
    handleCrazyEight,
}) => {

    return (
        <CrazyEightPres
            open={isSpecialCardSelected?.crazyEight?.condition}
            onClose={handleCrazyEight}
        />
    )
}
