import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"
import HyperLink from "../../components/ui/HyperLink"

// prettier-ignore
const Credits = () => {
  return (
    <Container>
      <Header to="/" title="Credits" />
      
      <div className="flex flex-col gap-y-4 leading-6">
        <p>
          Huge thanks to <HyperLink to="https://twitter.com/bruno_simon" text="Bruno Simon" /> {" "}
          for his wonderful course {" "}
          <HyperLink to="https://threejs-journey.com/" text="ThreeJS-Journey" />.
        </p>

        <p>
          Big thanks to <HyperLink to="https://www.youtube.com/@sentdex" text="Sentdex" />, <HyperLink to="https://www.youtube.com/@NetNinja" text="The Net Ninja" />, and <HyperLink to="https://www.youtube.com/@coreyms" text="Corey Schafer" /> {" "}
          for their great tutorials.
        </p>

        <p>
          <HyperLink to="https://skfb.ly/osu6Y" text="[Free] Rust dice" /> by Net Med is licensed under <HyperLink to="http://creativecommons.org/licenses/by/4.0/" text="Creative Commons Attribution" />.
        </p>

        <p>
          <HyperLink to="https://skfb.ly/ooZUF" text="Dices" /> by rogozhko is licensed under <HyperLink to="http://creativecommons.org/licenses/by/4.0/" text="Creative Commons Attribution" />.
        </p>

        <p>
          <HyperLink to="https://polyhaven.com/a/bell_park_pier" text="The bell park pier" /> from polyhaven by <HyperLink to="https://gregzaal.com/" text="Greg Zaal" />
        </p>

        <p>
          Sound Effects from <HyperLink to="https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=73225" text="Pixabay" />
        </p>

        <p>
          Sound Effect by <HyperLink to="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=124464" text="Universfield" /> from <HyperLink to="https://pixabay.com/sound-effects//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=124464" text="Pixabay" />
        </p>

        <p>
          Sound Effect by <HyperLink to="https://pixabay.com/users/soundsforyou-4861230/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=127856" text="SoundsForYou" /> from <HyperLink to="https://pixabay.com/sound-effects//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=127856" text="Pixabay" />
        </p>

        <p>
          Random name generator by <HyperLink to="https://names.drycodes.com/" text="drycodes" />
        </p>
      </div>
    </Container>
  )
}

export default Credits
