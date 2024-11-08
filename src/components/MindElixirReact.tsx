'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import MindElixir, { MindElixirInstance } from 'mind-elixir'
import { forwardRef, useEffect, useState } from 'react'
import { MindElixirDataWithSummary } from '../types'

function MindElixirReact(
  { style, data, options, className }: {
    style?: React.CSSProperties
    data: MindElixirDataWithSummary
    options?: Partial<MindElixirInstance>
    className?: string
  },
  ref: any
) {
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const me = new MindElixir({
      el: ref.current,
      ...options,
    });

    me.init(data as any);
    ref.current.instance = me;

    // Añadir listener para el evento de selección del nodo
    me.bus.addListener('selectNode', (node, e) => {
      const { summary } = node as MindElixirDataWithSummary['nodeData'];
      
      if (node && summary) {
        setSelectedSummary(summary);
        setPopoverPosition({ x: e?.pageX || 0, y: (e?.pageY  || 0) - 50 }); // Posicionar el Popover en la posición del clic
        setIsPopoverOpen(true); // Abre el Popover al seleccionar un nodo
      }
    });

  }, [ref, options, data]);

  return (
    <div ref={ref} style={style} className={className}>
      {/* Popover para mostrar el resumen en la posición del clic */}
      {isPopoverOpen && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div style={{ position: 'absolute', left: popoverPosition.x, top: popoverPosition.y }} className='z-50'></div>
          </PopoverTrigger>
          <PopoverContent>
            <p className='text-sm'>{selectedSummary}</p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

}

export default forwardRef(MindElixirReact)
