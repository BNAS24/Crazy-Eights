import { CrazyEightPres } from "./pres"

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
