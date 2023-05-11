/**
 * DEPRECATED: I'm using the GetDiceNumberAI from now on. It's just cooler. But his was cool too, to predict
 * the dice numbers with pure math
 */

import { RigidBodyApi } from "@react-three/rapier"
import { Euler } from "three"
import { TRAINING_DICE_MODE } from "../../data/Data"

const roundToTwo = (num: number) => {
  return Number(num.toFixed(2))
}

/**
 * Deprecated method. This method is a hot mess. But it works! I had to do a lot of pattern recognition
 * and a lot of math to get this to work. Probably the hardest function to build in this entire project.
 * This will get the current number on the dice that's pointing up, using the dice's rotation.
 * @returns The number on the dice that's pointing up
 * @deprecated
 */

const getDiceNumber = (dice: RigidBodyApi): number => {
  const euler = new Euler()
  euler.setFromQuaternion(dice.rotation())

  const x = euler.x
  const y = euler.y
  const z = euler.z

  if (TRAINING_DICE_MODE) {
    localStorage.setItem("dicePhysics", JSON.stringify({ x, y, z }))
  }

  // Either 1 or 6
  if (Math.round(Math.sin(x)) === 0 && Math.round(Math.sin(z)) === 0) {
    if (Math.round(Math.cos(x)) === Math.round(Math.cos(z))) {
      return 1
    }
    return 6
  }
  // Either 2 or 5
  else if (
    Math.round(Math.sin(x)) === 0 &&
    (Math.abs(Math.PI / 2 - z) < 0.2 || Math.PI / 2 + z < 0.2)
  ) {
    console.log("2 or 5 coming up: ", `{"x": ${x}, "y": ${y}, "z": ${z}}`)
    if (
      (Math.abs(Math.PI - x) < 0.2 &&
        roundToTwo(Math.abs(Math.PI / 2 - z)) <= 0.2) ||
      (Math.round(x) === 0 && roundToTwo(Math.abs(Math.PI / 2 + z)) <= 0.2)
    ) {
      return 2
    } else if (
      (Math.round(x) === 0 && roundToTwo(Math.abs(Math.PI / 2 - z)) <= 0.2) ||
      (Math.abs(Math.PI - x) < 0.2 &&
        roundToTwo(Math.abs(Math.PI / 2 + z)) <= 0.2)
    ) {
      return 5
    } else {
      console.log("Not a 2 or a 5")
      console.log(`{"x": ${x}, "y": ${y}, "z": ${z}}`)
      // throwDice([dice])
    }
  }
  // Either 3 or 4
  else if (
    (Math.abs(Math.PI / 2 - x) < 0.2 || Math.PI / 2 + x < 0.2) &&
    Math.round(y) === 0
  ) {
    if (Math.abs(-Math.PI / 2 - x) < 0.2 && Math.round(y) === 0) {
      return 3
    }
    return 4
  }

  // Don't know what the number is (Dice is on a slant angle)
  console.log("Don't know what the dice number is!")
  console.log(`{"x": ${x}, "y": ${y}, "z": ${z}}`)
  // throwDice([dice])
  return 0

  // Some dice examples of the rotation of the dice, when it's sleeping
  // 1:
  // {"x": 3.1256305108327114, "y": -1.5100878856031257, "z": 3.125425625711317}
  // {"x": 0.0015918107667124964, "y": 0.9168181096386551, "z": -0.0014976553076640048}
  // {"x": 3.13804536278938, "y": 1.2943213940467202, "z": -3.138414345918242}
  // {"x": 3.12742003833601, "y": 1.5024147409600717, "z": -3.1276875251313054}

  // 6:
  // {"x": 3.140433369281573, "y": 0.3143679093589594, "z": 0.0006222094766355095}
  // {"x": 0.0011179750282526919, "y": 0.16692008339263928, "z": -3.1415144481399584}
  // {"x": 3.1353754603318778, "y": -1.392534909366675, "z": -0.005855192785914245}
  // {"x": 2.453168729756934, "y": -1.5690479799581099, "z":-0.6881431960179334}

  // 2:
  // {"x": 3.1403126538063306, "y": 0.5320433465144419, "z": 1.5711823081418979}
  // {"x": 3.1404660421625574, "y": 0.20427773506826932, "z": 1.5707617934648705}
  // {"x": 3.140486805853115, "y": -0.06674640218556249, "z": 1.5704594270892702}
  // {"x": 0.0013081795188059772, "y": -0.567392941764316, "z": -1.5703564510510226}
  // {"x": 0.0017853684741958307, "y": -0.9048315317342623, "z": -1.5696554910671952}
  // {"x": 3.140484184061273, "y": 0.09948869613606177, "z": 1.5706431331915094}
  // {"x": 0.0011051515743079237, "y": -0.05958328548483913, "z": -1.570993595813825}
  // {"x": 0.0017257501292551579, "y": -0.8772986271071589, "z": -1.5697319242888867}
  // {"x": 3.1404301988223713, "y": -0.320732062342795, "z": 1.5701664825955897}
  // {"x": 3.1404847398618454, "y": -0.09350602269198391, "z": 1.570430075477538}
  // {"x": 0.18727401917531472, "y": -1.5648715445307704, "z": -1.3837890503153107}
  // {"x": 3.1374698936136816, "y": -1.2998401004739195, "z": 1.5665605838453622}
  // {"x": 0.0029257167302414637, "y": 1.1842025837212056, "z": -1.573769529445494}
  // {"x": 0.0026408800993509775, "y": -1.1397790045308973, "z": -1.5686599726719834}
  // {"x": 3.1402575212512303, "y": 0.5982204406165584, "z": 1.5712851317372114}
  // {"x": -2.9642883553647095, "y": 0.8726196882380701, "z": 1.572705373788906}
  // Error
  // {"x": 0.4016211959205549, "y": -1.5672929167887004, "z": -1.1693900473058703}

  // 5:
  // {"x": 0.0032598488772302685, "y": 1.2373032021064525, "z": 1.5679826373290204}
  // {"x": 3.035690283587604, "y": 1.560705808182779, "z": -1.464636251655983}
  // {"x": 3.1326444980894523, "y": 1.4512781459940003, "z": -1.5616445013681182}
  // {"x": 0.0011925065480864535, "y": -0.4628331346421611, "z": 1.5715953678039059}
  // {"x": 0.0015407456448840993, "y": -0.8060041320060982, "z": 1.5721749263779945}
  // {"x": 3.140400603183835, "y": 0.46221764034465446, "z": -1.5699978227551388}
  // {"x": 0.0039044432202154796, "y": -1.2939909322650116, "z": 1.574818577563266}
  // {"x": 3.1403858946464465, "y": 0.4866102233780405, "z": -1.569965077086509}
  // {"x": 0.002095713199950449, "y": 1.036589758452318, "z": 1.5692592143572257}
  // {"x": 3.1403331281136464, "y": -0.5603846470905822, "z": -1.5711989404681521}
  // {"x": 3.1394243203247236, "y": 1.0562896138266822, "z": -1.5686419821260387}
  // {"x": 0.0015637240502939837, "y": -0.819817763541371, "z": 1.5722060134228375}
  // {"x": 0.0012046405399716957, "y": -0.4829356227141875, "z": 1.571622279308555}
  // ERROR:
  // {"x": 2.7543638535573343, "y": -1.5679557494656726, "z": -1.957737619525883}
  // {"x": 0.3123176857112917, "y": 1.5672960436244494, "z": 1.2587120310126514}
  // {"x": 0.7477996843449919, "y": -1.5692130770749004, "z": 2.3188615048483534}
  // {"x": 2.6223685494164037, "y": -1.5686516306491678, "z": -2.0897597712627816}

  // 3:
  // {"x": -1.571931367850722, "y": 0.0001881356373814687, "z": 1.1767776045592004}
  // {"x": -1.5716724725046405, "y": -0.0007456993262120733, "z": 2.0462615833361797}
  // {"x": -1.5719437230744329, "y": 0.00008720360630970496, "z": 1.2655988224796977}
  // {"x": -1.5705021247792643, "y": -0.0011126348541532045, "z": -3.1129098026717217}
  // {"x": -1.5679237868561406, "y": -0.00046223189308869757, "z": 2.413183694896209}
  // {"x": -1.5714386432430838, "y": -0.0009548092019306174, "z": 2.3199923817585955}
  // {"x": -1.5696617859849085, "y": -0.00019346335782689835, "z": -1.9692813684483448}
  // {"x": -1.5697232385875557, "y": 0.0004148691918602225, "z": -1.431315561714728}

  // 4:
  // {"x": 1.5704485392704945, "y": -0.0010548007623856653, "z": -0.5604116875573528}
  // {"x": 1.5699358580507827, "y": 0.0007026587804618466, "z": -2.497997867938556}
  // {"x": 1.5704696590969753, "y": 0.0010615663990524216, "z": -3.084984119105789}
  // {"x": 1.5713303634432196, "y": 0.0009733864302914862, "z": 2.397477015782778}
  // {"x": 1.571480189229249, "y": -0.0008750758125155607, "z": 0.42114216012832184}
}

export default getDiceNumber
