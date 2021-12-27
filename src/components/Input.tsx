import {trackEvent} from 'appcenter-analytics';
import React, {useState} from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
const calculateInflationImpact = (
  value: number,
  inflationRate: number,
  time: string,
) => {
  return +value / Math.pow(1 + +inflationRate, +time);
};
const Input = () => {
  const [inputs, setinputs] = useState<{[key: string]: string}>({});

  const calculate = () => {
    const afterInflation = calculateInflationImpact(
      +inputs.amount,
      Number(inputs.inflationRate) / 100,
      inputs.timeInYears,
    );
    const atRiskFree =
      +inputs.amount *
      Math.pow(1 + +inputs.riskFreeRate / 100, +inputs.timeInYears);
    const atRiskFreeAfterInflation = calculateInflationImpact(
      atRiskFree,
      +inputs.inflationRate / 100,
      inputs.timeInYears,
    );
    const difference = atRiskFreeAfterInflation - afterInflation;
    setinputs(prev => ({
      ...prev,
      afterInflation: String(afterInflation),
      atRiskFree: String(atRiskFree),
      atRiskFreeAfterInflation: String(atRiskFreeAfterInflation),
      difference: String(difference),
    }));
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Current inflation rate in your country"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={inflationRate =>
          setinputs(prev => ({...prev, inflationRate}))
        }
      />
      <TextInput
        placeholder="Current risk free rate"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={riskFreeRate =>
          setinputs(prev => ({...prev, riskFreeRate}))
        }
      />
      <Text style={styles.smallLabel}>
        The risk free rate is the one offered by your country's central bank.
      </Text>
      <TextInput
        placeholder="Amount you are saving today"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={amount => setinputs(prev => ({...prev, amount}))}
      />
      <TextInput
        placeholder="For how long (in years) will you save that?"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={timeInYears =>
          setinputs(prev => ({...prev, timeInYears}))
        }
      />
      <Button
        title="Calculate real value"
        onPress={() => {
          calculate();
          trackEvent('calculate_inflation', {
            Internet: 'WiFi',
            GPS: 'Off',
          });
        }}
      />
      <Text style={styles.label}>
        {inputs.timeInYears} years from now you will still have $
        {parseFloat(inputs.amount)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
        , but it will only be worth $
        {parseFloat(inputs.afterInflation)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
        .
      </Text>
      <Text style={styles.label}>
        But if you invest it at a risk free rate you will have $
        {parseFloat(inputs.atRiskFree)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
        .
      </Text>
      <Text style={styles.label}>
        Which will be worth $
        {parseFloat(inputs.atRiskFreeAfterInflation)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
        after inflation.
      </Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

  label: {
    marginTop: 10,
  },
  smallLabel: {
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
    color: 'gray',
  },
  textBox: {
    height: 40,
    paddingLeft: 6,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 5,
  },
});
