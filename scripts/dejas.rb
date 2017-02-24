jas = ARGV[0]

tokens = jas.split(/\s+/)

stack = []
wave = "sine"

tokens.each do |token|
  p stack
  case token
  when "now", "sine", "tri", "ramp"
    stack.push token
  when /^\d+.?\d*$/
    stack.push token
  when "over"
    stack.push stack[-2]
  when "drop"
    stack.pop
  when "dup"
    x = stack.pop
    stack.push x
    stack.push x
  when "swap"
    x = stack.pop
    y = stack.pop
    stack.push x
    stack.push y
  when "rot"
    x = stack.pop
    y = stack.pop
    z = stack.pop
    stack.push y
    stack.push x
    stack.push z
  when "set_wave"
    wave = stack.pop
  when "*"
    x = stack.pop
    y = stack.pop
    stack.push "(#{y})*(#{x})"
  when "+"
    x = stack.pop
    y = stack.pop
    stack.push "#{y}+#{x}"
  when "wave"
    x = stack.pop
    stack.push "#{wave}(#{x})"
  when "inv"
    x = stack.pop
    stack.push "1/#{x}"
  else
    raise token.inspect
  end
end
p stack
puts stack.last
