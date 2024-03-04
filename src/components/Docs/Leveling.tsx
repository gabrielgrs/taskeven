import { getExpPerLevel } from '~/utils/configurations'
import Column from '../shared/Column'
import Grid from '../shared/Grid'

export default function Leveling() {
  return (
    <Grid>
      <Column size={12} className="flex items-center gap-8">
        <table className="table-auto w-full ">
          <thead className="text-muted-foreground">
            <td>Level</td>
            <td>Experience</td>
            <td>Recharge bonus</td>
          </thead>
          <tbody>
            {getExpPerLevel().map((expToLevel, index) => (
              <tr key={expToLevel} className="odd:bg-foreground/5 h-8">
                <td>Level {index + 1}</td>
                <td>{expToLevel} exp</td>
                <td>+{index + 1}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Column>
    </Grid>
  )
}
