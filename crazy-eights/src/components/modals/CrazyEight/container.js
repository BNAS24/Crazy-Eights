import { CrazyEightPres } from "./Pres"

export const CrazyEightContainer = ({
    isCrazyEight,
    handleCrazyEight,
}) => {

    return (
        <CrazyEightPres
            open={isCrazyEight}
            onClose={handleCrazyEight}
        />
    )
}
