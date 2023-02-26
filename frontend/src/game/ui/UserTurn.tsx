import toCapitalize from "../../components/utils/ToCapitalize"
import { DiceType } from "../types/Dice.type"
import { UserCheckerType } from "../types/Game.type"
import DiceMoves from "./DiceMoves"

type UserTurnProps = { userChecker: UserCheckerType; dice: DiceType }

const UserTurn = ({ userChecker, dice }: UserTurnProps) => {
  return (
    <div
      className={
        "absolute top-[80%] mt-2 w-full rounded-sm p-2 text-center " +
        (userChecker === "white"
          ? "bg-slate-200 text-black"
          : "bg-slate-600 text-white")
      }
    >
      <h1>{toCapitalize(userChecker!)} to play!</h1>
      {dice.moves > 0 && (
        <div className="mt-2 flex flex-col items-center">
          <h1 className="mb-1">Dice moves</h1>
          <DiceMoves dice={dice} />
        </div>
      )}
    </div>
  )
}

export default UserTurn
