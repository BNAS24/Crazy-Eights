import { CrazyEightPres } from "./Pres"

export const CrazyEightContainer = ({
    crazyEight,
    handleCrazyEight,
}) => {

    return (
        <CrazyEightPres
            open={crazyEight}
            onClose={handleCrazyEight}
        />
    )
}
